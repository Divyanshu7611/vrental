import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

interface CreateFundAccountParams {
  name: string;
  email: string;
  contact: string;
  accountType: "vpa" | "bank_account";
  vpa?: string;
  bankAccount?: {
    name: string;
    ifsc: string;
    account_number: string;
  };
}

interface CreatePayoutParams {
  fundAccountId: string;
  amount: number; // in paise (100 paise = 1 rupee)
  currency: string;
  mode: "UPI" | "NEFT" | "RTGS" | "IMPS";
  purpose: string;
  reference_id?: string;
}

/**
 * Create a contact in Razorpay (for Payouts)
 */
export async function createContact(name: string, email: string, contact: string) {
  try {
    const response = await fetch("https://api.razorpay.com/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        name,
        email,
        contact,
        type: "customer",
        reference_id: `contact_${Date.now()}`,
        notes: {
          created_via: "vrental_withdrawal",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || "Failed to create contact");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating contact:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a fund account (UPI or Bank Account)
 */
export async function createFundAccount(params: CreateFundAccountParams) {
  try {
    const fundAccountData: any = {
      contact_id: params.contact, // This should be contact ID from createContact
      account_type: params.accountType,
    };

    if (params.accountType === "vpa" && params.vpa) {
      fundAccountData.vpa = {
        address: params.vpa,
      };
    } else if (params.accountType === "bank_account" && params.bankAccount) {
      fundAccountData.bank_account = {
        name: params.bankAccount.name,
        ifsc: params.bankAccount.ifsc,
        account_number: params.bankAccount.account_number,
      };
    }

    // Note: Razorpay Payouts API uses different endpoint
    const response = await fetch("https://api.razorpay.com/v1/fund_accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(fundAccountData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || "Failed to create fund account");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating fund account:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a payout (transfer money)
 */
export async function createPayout(params: CreatePayoutParams) {
  try {
    const payoutData = {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER || "", // Your Razorpay account number
      fund_account_id: params.fundAccountId,
      amount: params.amount, // in paise
      currency: params.currency,
      mode: params.mode,
      purpose: params.purpose,
      queue_if_low_balance: true,
      reference_id: params.reference_id || `payout_${Date.now()}`,
      narration: "VRental Referral Withdrawal",
    };

    const response = await fetch("https://api.razorpay.com/v1/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(payoutData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || "Failed to create payout");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating payout:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get payout status
 */
export async function getPayoutStatus(payoutId: string) {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payouts/${payoutId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || "Failed to get payout status");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error getting payout status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Process withdrawal - Complete flow
 */
export async function processWithdrawal(
  userName: string,
  userEmail: string,
  userPhone: string,
  amount: number, // in rupees
  paymentMethod: "UPI" | "BANK",
  paymentDetails: {
    upiId?: string;
    bankAccount?: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    };
  }
) {
  try {
    // Step 1: Create contact
    const contactResult = await createContact(userName, userEmail, userPhone);
    if (!contactResult.success) {
      throw new Error(`Failed to create contact: ${contactResult.error}`);
    }

    const contactId = contactResult.data.id;

    // Step 2: Create fund account
    const fundAccountParams: CreateFundAccountParams = {
      name: userName,
      email: userEmail,
      contact: contactId,
      accountType: paymentMethod === "UPI" ? "vpa" : "bank_account",
    };

    if (paymentMethod === "UPI" && paymentDetails.upiId) {
      fundAccountParams.vpa = paymentDetails.upiId;
    } else if (paymentMethod === "BANK" && paymentDetails.bankAccount) {
      fundAccountParams.bankAccount = {
        name: paymentDetails.bankAccount.accountHolderName,
        ifsc: paymentDetails.bankAccount.ifscCode,
        account_number: paymentDetails.bankAccount.accountNumber,
      };
    }

    const fundAccountResult = await createFundAccount(fundAccountParams);
    if (!fundAccountResult.success) {
      throw new Error(`Failed to create fund account: ${fundAccountResult.error}`);
    }

    const fundAccountId = fundAccountResult.data.id;

    // Step 3: Create payout
    const payoutParams: CreatePayoutParams = {
      fundAccountId,
      amount: amount * 100, // Convert rupees to paise
      currency: "INR",
      mode: paymentMethod === "UPI" ? "UPI" : "IMPS",
      purpose: "refund",
      reference_id: `withdrawal_${Date.now()}`,
    };

    const payoutResult = await createPayout(payoutParams);
    if (!payoutResult.success) {
      throw new Error(`Failed to create payout: ${payoutResult.error}`);
    }

    return {
      success: true,
      data: {
        contactId,
        fundAccountId,
        payoutId: payoutResult.data.id,
        status: payoutResult.data.status,
        utr: payoutResult.data.utr, // Unique Transaction Reference
      },
    };
  } catch (error: any) {
    console.error("Error processing withdrawal:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
