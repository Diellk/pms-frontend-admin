# Quick Start Guide - Hotel PMS Admin Frontend

This guide will help you get started with the Hotel PMS Admin Frontend.

## Prerequisites

Before starting, ensure you have:
- ✅ Backend API running (default: `http://localhost:8080`)
- ✅ Node.js 18+ installed
- ✅ Admin user credentials

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Update the API URL if needed:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. Login

You'll be redirected to the login page automatically.

**Enter your credentials:**
- Username: Your admin username
- Password: Your admin password

![Login Page](docs/login-screenshot.png)

### 2. Dashboard

After successful login, you'll see the main dashboard with:
- **User Management** card - Click to manage users
- Other features (coming soon)

### 3. User Management

Click "Manage Users" to access the user management interface.

#### View Users

The user management page displays:
- **Statistics Card**: Overview of all users by role and status
- **Filters**: Filter users by role and status
- **User Table**: List of all users with actions

#### Create New User

1. Click the "Create User" button
2. Fill in the required fields:
   - First Name *
   - Last Name *
   - Username * (must be unique)
   - Password * (min 8 characters)
   - Email * (must be unique)
   - Phone (optional)
   - Role * (select from dropdown)
3. Click "Create User"

**Available Roles:**
- Administrator (full access)
- Front Desk Staff
- Housekeeping Staff
- Maintenance Staff

#### Edit User

1. Click the **⋮** (three dots) menu on any user row
2. Select "Edit User"
3. Update the desired fields
4. Toggle the "Active" checkbox to activate/deactivate
5. Click "Save Changes"

**Note:** You cannot change a user's role after creation.

#### Change Password

1. Click the **⋮** menu on any user row
2. Select "Change Password"
3. Enter new password (min 8 characters)
4. Confirm the password
5. Click "Change Password"

#### Activate/Deactivate User

**Quick Toggle:**
1. Click the **⋮** menu on any user row
2. Select "Activate" or "Deactivate"

**Via Edit:**
1. Edit the user
2. Toggle the "Active" checkbox
3. Save changes

#### Delete User

⚠️ **Warning:** This action is permanent and cannot be undone!

1. Click the **⋮** menu on any user row
2. Select "Delete User"
3. Confirm the deletion in the dialog

**Recommendation:** Consider deactivating users instead of deleting them to maintain audit trail.

## User Interface Features

### Filters

**Filter by Role:**
- All Roles
- Administrator
- Front Desk
- Housekeeping
- Maintenance

**Filter by Status:**
- All Status
- Active Only
- Inactive Only

### Statistics Dashboard

Real-time statistics showing:
- Total users count
- Active/inactive breakdown
- User count by each role

### Refresh Button

Click the refresh button (↻) to reload the user list.

## Common Tasks

### Creating Multiple Users

1. Click "Create User" for each new user
2. Fill in unique username and email for each
3. Assign appropriate roles

**Tip:** Keep a spreadsheet of usernames and roles for reference.

### Bulk Deactivation

Currently, users must be deactivated individually:
1. Filter by role or status if needed
2. Deactivate each user using the actions menu

**Future Enhancement:** Bulk operations will be added.

### Password Reset

As an admin, you can reset any user's password:
1. Use the "Change Password" action
2. Provide the new password to the user securely
3. Advise them to change it on first login (if self-service is enabled)

## Troubleshooting

### Can't Login

**Issue:** "Invalid credentials" error

**Solutions:**
- Verify username and password
- Check CAPS LOCK is off
- Ensure backend is running
- Verify you have admin role

### API Connection Error

**Issue:** Cannot connect to backend

**Solutions:**
- Check backend is running: `curl http://localhost:8080/api/auth/login`
- Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure backend CORS is configured for `http://localhost:3000`

### Token Expired

**Issue:** Automatically logged out

**Solutions:**
- Token has expired - simply log in again
- Contact admin if issue persists

### User Creation Fails

**Issue:** "Username already exists" or "Email already exists"

**Solutions:**
- Choose a different username
- Use a unique email address
- Check if user already exists in the system

### Page Not Loading

**Issue:** Blank page or loading forever

**Solutions:**
- Check browser console for errors
- Verify backend API is accessible
- Clear browser cache and localStorage
- Restart development server

## Keyboard Shortcuts

- **Esc**: Close dialogs/modals
- **Tab**: Navigate form fields
- **Enter**: Submit forms (when in input field)

## Best Practices

### User Management

1. **Unique Credentials**: Ensure each user has unique username and email
2. **Strong Passwords**: Use passwords with at least 8 characters
3. **Proper Roles**: Assign users the minimum role needed for their job
4. **Deactivate vs Delete**: Prefer deactivation over deletion for audit trail
5. **Regular Review**: Periodically review user list and deactivate unused accounts

### Security

1. **Logout**: Always logout when finished, especially on shared computers
2. **Password Security**: Never share admin credentials
3. **Regular Updates**: Keep passwords updated regularly
4. **Review Activity**: Monitor user creation and changes

### Organization

1. **Naming Convention**: Use consistent username format (e.g., firstname.lastname)
2. **Email Standard**: Use work emails for all staff
3. **Documentation**: Keep a record of which users have which roles
4. **Phone Numbers**: Include phone numbers for communication

## Next Steps

After mastering user management:

1. **Explore Statistics**: Review the statistics dashboard regularly
2. **Set Up Team**: Create accounts for all team members
3. **Train Staff**: Show relevant staff how to use their accounts
4. **Monitor Usage**: Track active vs inactive users

## Getting Help

### Documentation

- `README.md` - Complete project documentation
- `USER_MANAGEMENT_DOCUMENTATION.md` - Backend API documentation
- `auth.md` - Authentication API documentation

### Support

For technical issues:
1. Check browser console for error messages
2. Review backend logs
3. Contact your system administrator
4. Refer to troubleshooting section above

### Feature Requests

To request new features:
- Document the use case
- Describe the expected behavior
- Contact the development team

## Appendix

### User Roles Explained

| Role | Purpose | Typical Users |
|------|---------|---------------|
| **Administrator** | Full system access, manage all users and settings | IT staff, management |
| **Front Desk** | Check-in/out, bookings, guest management | Reception staff |
| **Housekeeping** | Room cleaning, status updates | Cleaning staff |
| **Maintenance** | Repairs, maintenance tasks | Maintenance crew |

### Status Meanings

- **Active**: User can log in and use the system
- **Inactive**: User cannot log in (account suspended)

### API Base URLs

- **Development**: `http://localhost:8080`
- **Production**: Update in `.env.local` for your production API

---

**Version:** 1.0  
**Last Updated:** February 2026  
**For:** Hotel PMS Admin Frontend
