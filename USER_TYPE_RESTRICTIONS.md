# User Type Restrictions

## Overview

The application now implements user type-based access control to provide a more personalized experience based on whether users are lessees (car renters), lessors (car owners), or both.

## User Types

### 1. **Lessee** (`lessee`) - Quero Alugar Carros
- **Can access**: Vehicle browsing, bookings, profile
- **Cannot access**: Vehicle listing, "Meus Carros"
- **Navigation shows**: "Encontrar Carros", "Minhas Reservas"

### 2. **Lessor** (`lessor`) - Quero Alugar Meu Carro  
- **Can access**: Vehicle browsing, vehicle listing, "Meus Carros", profile
- **Cannot access**: Bookings, "Minhas Reservas"
- **Navigation shows**: "Anunciar Seu Carro", "Meus Carros"

### 3. **Both** (`both`) - Ambos
- **Can access**: All features
- **Navigation shows**: All links

## Implementation Details

### Frontend Changes

1. **Header Navigation** (`Header.tsx`):
   - Conditionally shows navigation links based on user type
   - User dropdown menu items are filtered by user type

2. **Route Protection** (`RouteGuard.tsx`):
   - New component that protects routes based on user type
   - Redirects users to appropriate pages if they don't have access

3. **Profile Management** (`ProfilePage.tsx`):
   - Users can update their user type in their profile
   - Changes are saved to the backend and localStorage
   - Page refreshes to update navigation

4. **App Routes** (`App.tsx`):
   - All routes now use RouteGuard for protection
   - Different access levels for different user types

### Backend Changes

1. **User Controller** (`user.controller.ts`):
   - Added `PATCH /users/profile/me` endpoint for profile updates

2. **Auth Service** (`authService.ts`):
   - Added `updateProfile()` method

## Route Access Matrix

| Route | Lessee | Lessor | Both | Guest |
|-------|--------|--------|------|-------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/vehicles` | ✅ | ✅ | ✅ | ❌ |
| `/vehicle/:id` | ✅ | ✅ | ✅ | ❌ |
| `/bookings` | ✅ | ❌ | ✅ | ❌ |
| `/list-vehicle` | ❌ | ✅ | ✅ | ❌ |
| `/vehicles/my` | ❌ | ✅ | ✅ | ❌ |
| `/dashboard` | ✅ | ✅ | ✅ | ❌ |
| `/profile` | ✅ | ✅ | ✅ | ❌ |

## User Experience

### Registration
- Users select their primary intent during registration
- This determines their initial user type

### Profile Updates
- Users can change their user type anytime in their profile
- Changes take effect immediately (page refresh)
- Navigation adapts automatically

### Access Denied
- Users trying to access restricted pages are redirected to appropriate alternatives
- Lessees trying to access `/list-vehicle` → redirected to `/vehicles`
- Lessors trying to access `/bookings` → redirected to `/vehicles`

## Benefits

1. **Cleaner Interface**: Users only see relevant options
2. **Better UX**: No confusion about which features to use
3. **Flexibility**: Users can change their type as their needs evolve
4. **Security**: Prevents unauthorized access to features
