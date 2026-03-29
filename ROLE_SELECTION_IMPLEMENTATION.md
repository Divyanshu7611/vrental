# Role Selection Implementation Guide

## Overview
This document describes the implementation of role selection functionality for new users registering through both Google Sign-In and traditional email/password signup.

## Features Implemented

### 1. **Role Selection Modal** (`RoleSelectionModal.tsx`)
A beautiful, animated modal that appears for new users to select their role:
- **Two Role Options:**
  - **Renter (USER)**: For users looking to find properties
  - **Property Owner (OWNER)**: For users who want to list properties

- **Features:**
  - Animated slide-up entrance
  - Visual feedback with icons and colors
  - Cannot be dismissed without selecting a role (for new users)
  - Responsive design
  - Loading state during submission

### 2. **Google Sign-In Integration**
Modified `AuthMain.tsx` to handle role selection for new Google users:
- Detects if user is new (first-time sign-in)
- Shows role selection modal for new users
- Existing users bypass the modal and login directly
- Stores role in database after selection

### 3. **Traditional Signup Integration**
Updated `Signup.tsx` to include role selection:
- Role selection integrated into the signup form
- Two-step process:
  1. User details + role selection + terms acceptance
  2. OTP verification
- Visual toggle buttons for role selection
- Role is saved during registration

### 4. **Backend Updates**

#### Google Auth API (`/api/auth/google/route.ts`)
- Added `isNewUser` flag to response
- Accepts `role` parameter to update user role
- Creates new users with selected role
- Updates existing users' role if provided

#### Register API (`/api/auth/register/route.ts`)
- Already supports `role` field
- Defaults to "USER" if not provided
- Saves role during user creation

### 5. **Promotional Banner for Owners**
Added in `Navbar.tsx`:
- Displays "Limited Time Launch Offer – 50% OFF for Early Property Owners"
- Only visible to users with "OWNER" role
- Animated gradient background
- Pulsing emoji decorations
- Automatically adjusts navbar positioning

## User Flow

### Google Sign-In Flow
```
1. User clicks "Continue with Google"
2. Google authentication popup
3. System checks if user exists
   ├─ New User:
   │  ├─ Show Role Selection Modal
   │  ├─ User selects role (Renter or Owner)
   │  ├─ Role saved to database
   │  └─ Redirect to homepage
   └─ Existing User:
      ├─ Login directly
      └─ Redirect to homepage
```

### Traditional Signup Flow
```
1. User fills registration form
2. User selects role (Renter or Owner)
3. User accepts terms & conditions
4. Click "Continue"
5. OTP sent to email
6. User enters OTP
7. Click "Verify & Submit"
8. Account created with selected role
9. Redirect to homepage
```

## Files Modified/Created

### New Files
- `src/components/auth/RoleSelectionModal.tsx` - Role selection modal component

### Modified Files
- `src/components/auth/AuthMain.tsx` - Added role modal logic for Google sign-in
- `src/components/auth/Signup.tsx` - Added role selection to signup form
- `src/app/api/auth/google/route.ts` - Added role handling and isNewUser flag
- `src/components/global/Navbar.tsx` - Added promotional banner for owners
- `src/app/globals.css` - Added animations for modal and banner

## Role Types

### USER (Renter)
- Default role for users looking to rent properties
- Can browse listings
- Can add properties to wishlist
- Can contact property owners

### OWNER (Property Owner)
- For users who want to list properties
- Sees promotional banner (50% OFF offer)
- Can list properties
- Can manage their listings
- Receives inquiries from renters

## Styling & Animations

### Modal Animations
- **Slide-up entrance**: Smooth 0.3s animation
- **Hover effects**: Scale and shadow transitions
- **Selection feedback**: Color changes and checkmarks

### Banner Animations
- **Gradient flow**: 3s infinite animation
- **Pulsing emojis**: Built-in pulse animation
- **Slide-in text**: 1s ease-out animation

## Database Schema
The User model includes a `role` field:
```typescript
role: "USER" | "OWNER"
```

## Future Enhancements
- Add role switching in profile settings
- Add role-specific dashboards
- Add analytics for owner accounts
- Add verification badges for owners
- Add premium features for owners

## Testing Checklist
- [ ] New user signs up with email - can select role
- [ ] New user signs in with Google - sees role modal
- [ ] Existing user signs in with Google - no role modal
- [ ] Owner role sees promotional banner
- [ ] Renter role doesn't see promotional banner
- [ ] Role is saved correctly in database
- [ ] Modal cannot be dismissed without selection
- [ ] Animations work smoothly
- [ ] Responsive on mobile devices

## Notes
- The role selection modal for Google sign-in cannot be closed without selecting a role (intentional UX decision)
- Users can change their role later in profile settings (future feature)
- The promotional banner only appears for logged-in users with OWNER role
