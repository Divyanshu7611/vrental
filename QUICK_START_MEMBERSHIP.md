# 🚀 Quick Start - Membership System Integration

## Step 1: Install Razorpay

```bash
npm install razorpay
```

## Step 2: Add Environment Variables

Create/update `.env.local`:

```env
# Razorpay Test Keys (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

## Step 3: Add Razorpay Script to Layout

Update `src/app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## Step 4: Use Membership Modal

### Example 1: In Profile Page (Show for Owner's Apartments)

```tsx
"use client";
import { useState } from "react";
import MembershipModal from "@/components/payment/MembershipModal";

export default function ProfilePage() {
  const [showMembership, setShowMembership] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const handleUpgrade = (apartment) => {
    setSelectedApartment(apartment);
    setShowMembership(true);
  };

  return (
    <div>
      {/* Your apartments list */}
      {apartments.map(apt => (
        <div key={apt._id}>
          <h3>{apt.apartmentName}</h3>
          
          {/* Show membership status */}
          {apt.paymentStatus === "Pending" && (
            <button onClick={() => handleUpgrade(apt)}>
              🔒 Activate Membership
            </button>
          )}
          
          {apt.paymentStatus === "Verified" && (
            <div>
              ✅ Active until {new Date(apt.memberShipExpiry).toLocaleDateString()}
              <button onClick={() => handleUpgrade(apt)}>
                Renew Membership
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Membership Modal */}
      {selectedApartment && (
        <MembershipModal
          isOpen={showMembership}
          onClose={() => setShowMembership(false)}
          apartmentID={selectedApartment._id}
          apartmentName={selectedApartment.apartmentName}
          userID={userID}
        />
      )}
    </div>
  );
}
```

### Example 2: After Creating Apartment

```tsx
"use client";
import { useState } from "react";
import MembershipModal from "@/components/payment/MembershipModal";

export default function CreateApartmentPage() {
  const [showMembership, setShowMembership] = useState(false);
  const [createdApartment, setCreatedApartment] = useState(null);

  const handleSubmit = async (formData) => {
    // Create apartment
    const response = await axios.post("/api/apartment/create", formData);
    
    if (response.data.success) {
      const apartment = response.data.data;
      setCreatedApartment(apartment);
      
      // Show membership modal immediately
      setShowMembership(true);
    }
  };

  return (
    <div>
      {/* Your apartment creation form */}
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>

      {/* Membership Modal */}
      {createdApartment && (
        <MembershipModal
          isOpen={showMembership}
          onClose={() => {
            setShowMembership(false);
            // Redirect to profile
            router.push("/profile");
          }}
          apartmentID={createdApartment._id}
          apartmentName={createdApartment.apartmentName}
          userID={userID}
        />
      )}
    </div>
  );
}
```

## Step 5: Add Expiry Notifications to Navbar

Update `src/components/global/NotificationDropdown.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationDropdown({ userID }) {
  const [membershipNotifications, setMembershipNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `/api/membership/check-expiry?userID=${userID}`
        );
        if (response.data.success) {
          setMembershipNotifications(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    // Check every hour
    const interval = setInterval(fetchNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userID]);

  return (
    <div className="notification-dropdown">
      {/* Membership Notifications */}
      {membershipNotifications.map(notif => (
        <div 
          key={notif.apartmentID}
          className={`notification-item ${
            notif.priority === 'urgent' ? 'bg-red-50' : 'bg-yellow-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {notif.priority === 'urgent' ? '🚨' : '⚠️'}
            <div>
              <p className="font-semibold">{notif.message}</p>
              <button className="text-blue-600 text-sm mt-1">
                Renew Now →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Other notifications */}
    </div>
  );
}
```

## Step 6: Filter Apartments by Membership

Update apartment listing API to only show active memberships:

```tsx
// In your apartment listing component
const fetchApartments = async () => {
  const response = await axios.get("/api/apartments/list");
  
  // Filter only apartments with active membership
  const activeApartments = response.data.data.filter(apt => {
    if (apt.paymentStatus !== "Verified") return false;
    
    const expiryDate = new Date(apt.memberShipExpiry);
    const now = new Date();
    
    return expiryDate > now; // Only show non-expired
  });
  
  setApartments(activeApartments);
};
```

## Step 7: Test Payment Flow

### Test Cards (Razorpay Test Mode):

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

**Failure:**
- Card: `4000 0000 0000 0002`

### Test Flow:

1. Create apartment → Status: "Not Available For Rent"
2. Click "Activate Membership"
3. Select plan (e.g., 6 months - ₹1,499)
4. Click "Proceed to Payment"
5. Enter test card details
6. Payment succeeds
7. Apartment status → "Available For Rent"
8. Apartment visible on listings ✅

## Step 8: Production Checklist

- [ ] Get live Razorpay keys
- [ ] Update `.env.local` with live keys
- [ ] Test payment flow in test mode
- [ ] Set up webhook for payment updates
- [ ] Add cron job for expiry checks
- [ ] Test expiry notifications
- [ ] Deploy to production

## 🎉 Done!

Your membership system is ready! Users can now:
- ✅ Create apartments (hidden by default)
- ✅ Purchase membership plans
- ✅ Apartments become visible after payment
- ✅ Receive expiry notifications
- ✅ Renew memberships easily

**Start testing with Razorpay test mode now!** 🚀
