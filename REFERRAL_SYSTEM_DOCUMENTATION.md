# VRENTAL Referral System Documentation

## Overview
The VRENTAL Referral System allows property owners to earn rewards by referring other users to register properties on the platform.

## How It Works

### For Property Owners (Referrers)
1. **Get Your Referral Code**: Each property owner automatically gets a unique referral code (same as their user ID)
2. **Share Your Code**: Share your referral code with other property owners
3. **Earn Points**: When someone registers a property using your code, you earn **10 points (₹10)**
4. **Withdraw Earnings**: Once you accumulate **100 points (₹100)**, you can request a withdrawal

### For New Users (Referees)
1. When registering a property, you can optionally enter a referral code
2. The referral code helps the property owner who referred you earn rewards
3. You can only use a referral code once

## Points System
- **1 Point = ₹1 (1 Rupee)**
- **Points per Referral**: 10 points
- **Minimum Withdrawal**: 100 points (₹100)
- **No Maximum Limit**: Earn unlimited points

## API Endpoints

### 1. Apply Referral Code
**POST** `/api/referral/apply`

Apply a referral code when registering a property.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Body:**
```json
{
  "referralCode": "USER_ID_HERE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Referral code applied successfully! John Doe earned 10 points.",
  "data": {
    "referrerName": "John Doe",
    "pointsEarned": 10
  }
}
```

### 2. Get Referral Stats
**GET** `/api/referral/stats`

Get referral statistics for the current user.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referralCode": "USER123ABC",
    "referralPoints": 150,
    "referralEarnings": 150,
    "totalReferrals": 15,
    "totalWithdrawn": 0,
    "pendingWithdrawals": 0,
    "canWithdraw": true,
    "referralHistory": [...],
    "withdrawalHistory": [...],
    "isOwner": true
  }
}
```

### 3. Request Withdrawal
**POST** `/api/referral/withdraw`

Request to withdraw earned points.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Body:**
```json
{
  "points": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal request for ₹100 submitted successfully!",
  "data": {
    "amount": 100,
    "remainingPoints": 50,
    "status": "PENDING"
  }
}
```

### 4. Get All Withdrawal Requests (Admin Only)
**GET** `/api/referral/withdraw`

Get all pending withdrawal requests.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 5
}
```

### 5. Update Withdrawal Status (Admin Only)
**POST** `/api/referral/withdraw/update`

Approve or reject a withdrawal request.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Body:**
```json
{
  "userId": "USER_ID",
  "withdrawalId": "WITHDRAWAL_ID",
  "status": "COMPLETED",
  "transactionId": "TXN123456"
}
```

## Database Schema

### User Model Updates
```typescript
{
  // Existing fields...
  
  // Referral System Fields
  referralCode: String,           // Unique referral code (same as _id)
  referredBy: String,             // ID of the user who referred this user
  referralPoints: Number,         // Current available points
  referralEarnings: Number,       // Total lifetime earnings
  referralHistory: [{
    referredUserId: ObjectId,
    referredUserName: String,
    pointsEarned: Number,
    date: Date
  }],
  withdrawalHistory: [{
    amount: Number,
    pointsDeducted: Number,
    status: "PENDING" | "COMPLETED" | "REJECTED",
    requestDate: Date,
    completedDate: Date,
    transactionId: String
  }]
}
```

## Components

### 1. ReferralDashboard
**Location**: `src/components/Profile/ReferralDashboard.tsx`

A complete dashboard for property owners to:
- View their referral code
- Share referral code
- See referral statistics
- Request withdrawals
- View referral history
- View withdrawal history

**Usage:**
```tsx
import ReferralDashboard from "@/components/Profile/ReferralDashboard";

<ReferralDashboard />
```

### 2. ReferralCodeInput
**Location**: `src/components/Form/ReferralCodeInput.tsx`

A component to add to the property registration form for users to enter a referral code.

**Usage:**
```tsx
import ReferralCodeInput from "@/components/Form/ReferralCodeInput";

<ReferralCodeInput onSuccess={() => console.log("Code applied!")} />
```

## Integration Steps

### Step 1: Add to Property Registration Form
Add the `ReferralCodeInput` component to your property registration form (Step1.tsx):

```tsx
import ReferralCodeInput from "@/components/Form/ReferralCodeInput";

// In your form component
<ReferralCodeInput />
```

### Step 2: Add Referral Dashboard to Profile
Add a link to the referral dashboard in the user profile:

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

<button onClick={() => router.push("/profile/referrals")}>
  View Referral Dashboard
</button>
```

### Step 3: Create Referral Dashboard Page
Create a new page at `src/app/profile/referrals/page.tsx`:

```tsx
import ReferralDashboard from "@/components/Profile/ReferralDashboard";

export default function ReferralsPage() {
  return <ReferralDashboard />;
}
```

## Admin Panel Integration

### Withdrawal Management
Admins should have access to:
1. View all pending withdrawal requests
2. Approve/reject withdrawals
3. Add transaction IDs for completed withdrawals

**Example Admin Component:**
```tsx
const approveWithdrawal = async (userId, withdrawalId) => {
  const token = localStorage.getItem("token");
  await axios.post(
    "/api/referral/withdraw/update",
    {
      userId,
      withdrawalId,
      status: "COMPLETED",
      transactionId: "TXN123456"
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
```

## Security Considerations

1. **Token Verification**: All endpoints verify JWT tokens
2. **Role Checks**: Only OWNER role can earn and withdraw
3. **One-Time Use**: Users can only use a referral code once
4. **Self-Referral Prevention**: Users cannot use their own referral code
5. **Admin Only**: Withdrawal approval requires ADMIN role

## Business Rules

1. **Points per Referral**: 10 points (configurable in code)
2. **Minimum Withdrawal**: 100 points
3. **Conversion Rate**: 1 point = ₹1
4. **Withdrawal Processing**: 3-5 business days
5. **One Pending Withdrawal**: Users can only have one pending withdrawal at a time
6. **Point Refund**: If withdrawal is rejected, points are refunded

## Testing

### Test Scenarios
1. Apply valid referral code
2. Apply invalid referral code
3. Try to use own referral code
4. Try to use referral code twice
5. Request withdrawal with sufficient points
6. Request withdrawal with insufficient points
7. Request withdrawal with pending request
8. Admin approve withdrawal
9. Admin reject withdrawal

## Future Enhancements

1. **Tiered Rewards**: Different point values based on property type
2. **Bonus Points**: Special promotions and bonus point events
3. **Leaderboard**: Top referrers leaderboard
4. **Email Notifications**: Notify users of referral success and withdrawals
5. **Referral Analytics**: Detailed analytics dashboard
6. **Social Sharing**: Direct social media sharing integration
7. **QR Codes**: Generate QR codes for referral codes

## Support

For issues or questions about the referral system:
- Email: support@vrental.in
- Documentation: This file
- API Errors: Check console logs and error messages
