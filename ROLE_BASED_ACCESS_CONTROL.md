# Role-Based Access Control Implementation

## Overview
Implemented role-based access control to ensure only OWNER role users can list properties. USER role can only browse and view properties.

## Changes Made

### 1. List Apartment Page (`/list-apartment/page.tsx`)
**Access Control:**
- ✅ Checks if user is logged in
- ✅ Checks if user role is "OWNER"
- ✅ Shows access denied page for non-owners
- ✅ Shows property listing form only for owners

**Access Denied Page Features:**
- Clear "Access Restricted" message
- Shield alert icon
- Information about upgrading to OWNER account
- Contact support button (mailto:support@vrental.in)
- Navigation buttons:
  - Browse Properties (redirects to home)
  - Go to Profile

### 2. Profile Action Buttons (`ProfileRating.tsx`)
**Conditional Rendering:**
- **For OWNER users:**
  - Edit Profile button
  - Add Apartment button (redirects to /list-apartment)
  
- **For USER/RENTER users:**
  - Edit Profile button
  - Browse Properties button (redirects to home page)

### 3. Navbar (`Navbar.tsx`)
**Already Implemented:**
- "List Property" link only visible to OWNER role users
- Hidden for USER/RENTER roles

## User Roles

### OWNER Role
**Permissions:**
- ✅ Can list properties
- ✅ Can view all properties
- ✅ Can access referral system
- ✅ Can earn referral points
- ✅ Can withdraw earnings
- ✅ See "Add Apartment" button in profile
- ✅ See "List Property" in navbar

### USER/RENTER Role
**Permissions:**
- ✅ Can browse properties
- ✅ Can view property details
- ✅ Can add properties to wishlist
- ✅ Can contact property owners
- ❌ Cannot list properties
- ❌ Cannot access referral system
- ❌ Cannot see "List Property" options

## User Experience Flow

### For OWNER Users:
1. Login → Profile shows "Add Apartment" button
2. Click "Add Apartment" → Property listing form
3. Fill form → Submit property
4. Property appears in their profile

### For USER/RENTER Users:
1. Login → Profile shows "Browse Properties" button
2. Try to access /list-apartment → Access denied page
3. Shown upgrade information
4. Can contact support to upgrade to OWNER

## Security Features

1. **Frontend Validation:**
   - Role check in component rendering
   - Conditional UI elements
   - Toast notifications for unauthorized access

2. **Page-Level Protection:**
   - useEffect hook checks user role on mount
   - Redirects non-owners to access denied page
   - Prevents form rendering for unauthorized users

3. **User Feedback:**
   - Clear error messages
   - Helpful upgrade instructions
   - Alternative action buttons

## How to Upgrade USER to OWNER

### Manual Process (Current):
1. User contacts support@vrental.in
2. Admin verifies user identity
3. Admin updates user role in database:
   ```javascript
   db.users.updateOne(
     { _id: userId },
     { $set: { role: "OWNER" } }
   )
   ```

### Future Enhancement (Recommended):
- Create admin panel for role management
- Add verification process for property owners
- Implement document upload for verification
- Add payment/subscription for OWNER accounts

## Testing Scenarios

### Test Case 1: USER tries to list property
1. Login as USER
2. Navigate to /list-apartment
3. **Expected:** Access denied page shown
4. **Expected:** Toast error: "Only property owners can list properties"

### Test Case 2: OWNER lists property
1. Login as OWNER
2. Navigate to /list-apartment
3. **Expected:** Property listing form shown
4. **Expected:** Can submit property successfully

### Test Case 3: Profile buttons
1. Login as USER
2. Go to profile
3. **Expected:** See "Browse Properties" button
4. Login as OWNER
5. Go to profile
6. **Expected:** See "Add Apartment" button

### Test Case 4: Navbar visibility
1. Login as USER
2. **Expected:** "List Property" not visible in navbar
3. Login as OWNER
4. **Expected:** "List Property" visible in navbar

## API Endpoints (No Changes Needed)

The backend already handles role-based access:
- Property creation APIs check user authentication
- User data includes role information
- Frontend enforces UI-level restrictions

## Benefits

1. **Security:** Prevents unauthorized property listings
2. **User Experience:** Clear messaging about permissions
3. **Business Model:** Enables premium OWNER accounts
4. **Data Quality:** Only verified owners can list properties
5. **Scalability:** Easy to add more role-based features

## Future Enhancements

1. **ADMIN Role:**
   - Manage all properties
   - Approve/reject listings
   - Manage user roles
   - View analytics

2. **PREMIUM_OWNER Role:**
   - Featured listings
   - Priority support
   - Advanced analytics
   - Unlimited properties

3. **Verification System:**
   - Document upload
   - Identity verification
   - Property ownership proof
   - Automated approval workflow

4. **Subscription Plans:**
   - Free tier (limited listings)
   - Basic OWNER (standard features)
   - Premium OWNER (advanced features)
   - Enterprise (multiple properties)

## Support Contact

For role upgrade requests:
- Email: support@vrental.in
- Include: User ID, Name, Reason for upgrade
- Response time: 24-48 hours
