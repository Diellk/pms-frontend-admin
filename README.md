# Hotel PMS Admin Frontend - User Management & Property Management

This is the admin frontend for the Hotel Property Management System, built with Next.js, TypeScript, shadcn/ui, and Tailwind CSS.

## Features

### Authentication
- **JWT-based Login**: Secure authentication with JWT tokens
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **User Context**: Global authentication state management
- **Token Validation**: Automatic token validation on app load
- **Logout**: Clear session and redirect to login

### User Management
- **Create Users**: Add new staff members with different roles (Admin, Front Desk, Housekeeping, Maintenance)
- **View Users**: Browse all users with filtering by role and status
- **Edit Users**: Update user information including name, email, phone, and active status
- **Change Password**: Admin can reset any user's password
- **Activate/Deactivate**: Toggle user account status without deletion
- **Delete Users**: Permanently remove user accounts
- **Statistics Dashboard**: Real-time overview of user counts by role and status

### Property Management
- **Room Type Management**: Create and manage room categories with pricing, amenities, and specifications
- **Bulk Room Operations**: Create, update, delete, or reassign multiple rooms at once
- **Floor Management**: View and manage rooms organized by floor level
- **Property Statistics**: Real-time metrics on room inventory, occupancy, and maintenance
- **Room Type Features**:
  - Base pricing per night
  - Maximum occupancy settings
  - Room size and bed type configuration
  - Amenity selection from common options
  - Image gallery management
  - Active/inactive status toggle
- **Bulk Operations**:
  - Bulk create rooms for entire floors
  - Bulk update room status (READY, CLEANING, MAINTENANCE, OCCUPIED, OUT_OF_ORDER)
  - Bulk assign room types for property reorganization
  - Bulk delete with safety checks for occupied rooms
- **Floor Operations**:
  - View all rooms on a specific floor
  - Update status of all rooms on a floor simultaneously
  - Useful for maintenance scheduling and event management

### Financial Reporting & Analytics
- **Financial Dashboard**: Comprehensive overview with today's, MTD, and YTD metrics
- **Revenue Reports**: Detailed revenue analysis with ADR, RevPAR, and breakdowns by channel/room type
- **Expense Reports**: Track expenses by category with payment status monitoring
- **Occupancy Reports**: Monitor occupancy rates, room nights, and daily breakdowns
- **Custom Date Ranges**: Generate reports for any time period
- **Key Performance Indicators**: ADR, RevPAR, occupancy rates, profit margins
- **Growth Analysis**: Compare current vs previous month performance

## Project Structure

```
pms-frontend-admin/
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Home page with navigation cards
│   ├── globals.css                # Global styles
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── users/
│   │   └── page.tsx               # User management page route
│   ├── property/
│   │   └── page.tsx               # Property management page route
│   └── financial/
│       └── page.tsx               # Financial reports page route
├── components/
│   ├── auth/
│   │   └── protected-route.tsx    # Route protection wrapper
│   ├── layout/
│   │   └── header.tsx             # App header with user menu
│   ├── property/                  # Property management components
│   │   ├── property-management-page.tsx
│   │   ├── property-statistics-card.tsx
│   │   ├── room-type-management.tsx
│   │   ├── create-room-type-dialog.tsx
│   │   ├── edit-room-type-dialog.tsx
│   │   ├── bulk-operations-management.tsx
│   │   ├── bulk-create-rooms-dialog.tsx
│   │   └── floor-management.tsx
│   ├── financial/                 # Financial reporting components
│   │   ├── financial-reports-page.tsx
│   │   ├── financial-dashboard-view.tsx
│   │   ├── revenue-report-view.tsx
│   │   ├── expense-report-view.tsx
│   │   ├── occupancy-report-view.tsx
│   │   └── metric-card.tsx
│   ├── ui/                        # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── textarea.tsx
│   │   ├── alert-dialog.tsx
│   │   └── dropdown-menu.tsx
│   └── users/                     # User management components
│       ├── user-management-page.tsx
│       ├── user-statistics-card.tsx
│       ├── create-user-dialog.tsx
│       ├── edit-user-dialog.tsx
│       └── change-password-dialog.tsx
├── lib/
│   ├── api/
│   │   ├── auth-api.ts           # Authentication API service
│   │   ├── financial-api.ts      # Financial reporting API service
│   │   ├── property-api.ts       # Property management API service
│   │   └── user-api.ts           # User management API service
│   ├── contexts/
│   │   └── auth-context.tsx      # Authentication context provider
│   ├── types/
│   │   ├── auth.ts               # Authentication types
│   │   ├── financial.ts          # Financial reporting types
│   │   ├── property.ts           # Property management types
│   │   └── user.ts               # User management types
│   └── utils.ts                  # Utility functions (formatting, etc.)
└── .env.local                    # Environment variables
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (default: http://localhost:8080)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` to set your backend API URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Login

The application will redirect you to the login page. Use your admin credentials to log in.

**Default Admin Credentials** (if set up in backend):
- Username: `admin`
- Password: (contact system administrator)

After login, you'll be redirected to the home page with access to user management features.

## Authentication Flow

### How Authentication Works

1. **Login**: User enters credentials on `/login` page
2. **Token Storage**: JWT token is stored in `localStorage` as `authToken`
3. **Auto-Validation**: On app load, token is validated via `/api/auth/me`
4. **Protected Routes**: All routes except `/login` require authentication
5. **Logout**: Clears token and redirects to login page

### Authentication Context

The app uses React Context for global authentication state:

```typescript
const { user, loading, login, logout, isAuthenticated } = useAuth()
```

**Available Properties:**
- `user`: Current user information (null if not authenticated)
- `loading`: Boolean indicating authentication check in progress
- `login(credentials)`: Login function
- `logout()`: Logout function
- `isAuthenticated`: Boolean indicating if user is authenticated

## API Integration

The frontend connects to the backend API with endpoints documented in `USER_MANAGEMENT_DOCUMENTATION.md` and `auth.md`.

### Authentication API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Authenticate user and receive JWT token |
| `/api/auth/validate` | POST | Validate JWT token |
| `/api/auth/me` | GET | Get current authenticated user |

### User Management API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/users` | GET | Get all users with optional filters |
| `/api/admin/users` | POST | Create new user |
| `/api/admin/users/{id}` | GET | Get user by ID |
| `/api/admin/users/{id}` | PUT | Update user |
| `/api/admin/users/{id}` | DELETE | Delete user |
| `/api/admin/users/{id}/password` | PUT | Change user password |
| `/api/admin/users/{id}/activate` | POST | Activate user |
| `/api/admin/users/{id}/deactivate` | POST | Deactivate user |
| `/api/admin/users/statistics` | GET | Get user statistics |

### Property Management API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/room-types` | GET | Get all room types with optional filters |
| `/api/admin/room-types` | POST | Create new room type |
| `/api/admin/room-types/{id}` | GET | Get room type by ID |
| `/api/admin/room-types/name/{name}` | GET | Get room type by name |
| `/api/admin/room-types/{id}` | PUT | Update room type |
| `/api/admin/room-types/{id}` | DELETE | Delete room type |
| `/api/admin/room-types/{id}/activate` | POST | Activate room type |
| `/api/admin/room-types/{id}/deactivate` | POST | Deactivate room type |
| `/api/admin/room-types/statistics` | GET | Get property statistics |
| `/api/admin/property/rooms/bulk-create` | POST | Bulk create rooms |
| `/api/admin/property/rooms/bulk-update-status` | POST | Bulk update room status |
| `/api/admin/property/rooms/bulk-delete` | DELETE | Bulk delete rooms |
| `/api/admin/property/rooms/bulk-assign-type` | POST | Bulk assign room type |
| `/api/admin/property/floors/{floor}/rooms` | GET | Get rooms by floor |
| `/api/admin/property/floors/{floor}/bulk-update-status` | POST | Update floor status |

### Financial Reporting API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/financial/dashboard` | GET | Get comprehensive financial dashboard |
| `/api/admin/financial/revenue` | GET | Get custom date range revenue report |
| `/api/admin/financial/revenue/today` | GET | Get today's revenue |
| `/api/admin/financial/revenue/week` | GET | Get this week's revenue |
| `/api/admin/financial/revenue/month` | GET | Get this month's revenue |
| `/api/admin/financial/revenue/year` | GET | Get this year's revenue |
| `/api/admin/financial/expenses` | GET | Get custom date range expense report |
| `/api/admin/financial/expenses/today` | GET | Get today's expenses |
| `/api/admin/financial/expenses/month` | GET | Get this month's expenses |
| `/api/admin/financial/expenses/year` | GET | Get this year's expenses |
| `/api/admin/financial/occupancy` | GET | Get custom date range occupancy report |
| `/api/admin/financial/occupancy/today` | GET | Get today's occupancy |
| `/api/admin/financial/occupancy/month` | GET | Get this month's occupancy |
| `/api/admin/financial/occupancy/year` | GET | Get this year's occupancy |
| `/api/admin/financial/stats/quick` | GET | Get quick financial statistics |

## User Roles

The system supports the following user roles:

- **ADMIN**: Full system access, can manage all users
- **FRONT_DESK**: Check-in/check-out, bookings, guest management
- **HOUSEKEEPING**: Cleaning tasks, room status updates
- **MAINTENANCE**: Maintenance tasks, room repairs
- **GUEST**: Limited access to self-service features

## Components

### UserManagementPage
Main page component that displays the user list with filters, actions, and statistics.

**Features:**
- Filter by role and status
- Real-time user statistics
- Create, edit, delete users
- Change passwords
- Activate/deactivate users

### PropertyManagementPage
Main page component for managing property inventory with tabbed interface.

**Features:**
- Property statistics overview
- Room type management
- Bulk operations interface
- Floor management tools

### RoomTypeManagement
Component for managing room type categories.

**Features:**
- Create new room types with pricing and amenities
- Edit existing room types
- Activate/deactivate room types
- Delete room types (with safety checks)
- Filter by active/inactive status

### BulkOperationsManagement
Interface for performing bulk operations on multiple rooms.

**Features:**
- Bulk create rooms for entire floors
- Bulk update room status
- Bulk assign room types
- Bulk delete with safety checks

### FloorManagement
Component for viewing and managing rooms by floor.

**Features:**
- View all rooms on a specific floor
- Update status of entire floor
- Room inventory display by floor

### CreateUserDialog
Modal dialog for creating new users.

**Required Fields:**
- Username (unique)
- Password (min 8 characters)
- First Name
- Last Name
- Email (unique)
- Role

**Optional Fields:**
- Phone

### EditUserDialog
Modal dialog for editing existing users.

**Editable Fields:**
- Username
- First Name
- Last Name
- Email
- Phone
- Active status

**Note:** Role cannot be changed after creation.

### ChangePasswordDialog
Modal dialog for admin password reset.

**Features:**
- Password confirmation
- Minimum 8 characters validation
- No old password required (admin override)

### UserStatisticsCard
Dashboard card showing user counts.

**Displays:**
- Total users
- Active/inactive users
- Count by role (Admin, Front Desk, Housekeeping, Maintenance)

## Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components
- **Radix UI**: Unstyled, accessible component primitives
- **lucide-react**: Beautiful icon library

## Development

### Adding New Features

1. **New API Endpoint**: Add to `lib/api/user-api.ts`
2. **New Types**: Add to `lib/types/user.ts`
3. **New Component**: Create in `components/users/`
4. **New Page**: Create in `app/[route]/page.tsx`

### Code Style

- Use TypeScript for type safety
- Use "use client" directive for client components
- Follow React hooks best practices
- Use async/await for API calls
- Handle loading and error states

## Error Handling

All API errors are caught and displayed to users with helpful messages. Common errors:

- **400 Bad Request**: Validation error (e.g., username already exists)
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

## Security Considerations

1. **JWT Authentication**: All requests require valid JWT token
2. **Admin Only**: Only ADMIN role users can access user management
3. **Password Hashing**: Passwords are hashed by backend (BCrypt)
4. **HTTPS**: Use HTTPS in production
5. **CORS**: Configure CORS on backend for production domain

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Environment variables for production:
```
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features to add:

- [ ] Bulk user operations (import/export CSV)
- [ ] User activity logging
- [ ] Advanced search and filtering
- [ ] User profile pictures
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Password policy enforcement
- [ ] Session management
- [ ] Audit trail

## Troubleshooting

### API Connection Issues
- Check if backend is running on correct port
- Verify NEXT_PUBLIC_API_BASE_URL in .env.local
- Check browser console for CORS errors

### Authentication Issues
- Ensure JWT token is set in localStorage
- Check token expiration
- Verify token format (Bearer token)

### Build Issues
- Clear .next folder: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## Support

For issues or questions:
1. Check the USER_MANAGEMENT_DOCUMENTATION.md for user management details
2. Check the PROPERTY_MANAGEMENT_DOCUMENTATION.md for property management details
3. Check the FINANCIAL_REPORTING_DOCUMENTATION.md for financial reporting details
4. Review API endpoint documentation
5. Check browser console for errors
6. Contact the development team

## License

Proprietary - Hotel Management System
