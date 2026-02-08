# PROJECT CONTEXT

## Project Overview

This is a **real estate platform** for the Moroccan market that handles both **property rentals** (location) and **property sales** (vente). The platform allows users to browse properties, make reservations for rentals, submit purchase inquiries (leads), and includes a comprehensive admin dashboard for managing all aspects of the business.

The platform targets three user types:
- **Guest users**: Can browse properties and make reservations without an account
- **Authenticated users**: Can register, log in, and manage their reservations
- **Admin users**: Full access to dashboard with enhanced security (2FA via email OTP)

---

## Tech Stack

### Frontend
- **Next.js 14.0.4** (App Router architecture)
- **React 18.2.0**
- **TypeScript 5.3.3**
- **Tailwind CSS 3.4.0** for styling
- **Tiptap Editor** for rich text editing (blogs, property descriptions)
  - Extensions: StarterKit, YouTube embed, Link, Color, TextStyle, Image, TextAlign

### Backend
- **Node.js** with **Express 4.18.2**
- **TypeScript** for type safety
- **Prisma 5.8.0** as ORM
- **PostgreSQL** database
- **tsx** for development server with watch mode
- **concurrently** to run both Next.js and Express servers

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)** stored in httpOnly cookies
- **bcryptjs 2.4.3** for password hashing
- **Session-based authentication** with database session tracking
- **OTP verification** for admin 2FA (via email)
- **Auto-logout** after 5 minutes of inactivity (admin sessions)
- **CORS** configured for localhost:3000

### External Services
- **Cloudinary 2.8.0** for image and video hosting
- **Nodemailer 7.0.12** for email service (OTP codes, notifications)
- **Zod 3.22.4** for schema validation

---

## User Roles & Access Control

### 1. Guest User (No Account)
- Browse all published properties
- Filter by listing type (LOCATION/VENTE)
- Make reservations without creating an account
- Submit leads (sales inquiries)
- No access to dashboard

### 2. Authenticated User (USER role)
- All guest capabilities
- Register with email/username and password
- Login with email or username
- View reservation history
- Manage profile

### 3. Admin (ADMIN role)
- **Two-Factor Authentication (2FA)**:
  - Step 1: Login with credentials
  - Step 2: Enter OTP code sent to `saidiavibe@gmail.com`
- **Auto-logout**: Session expires after 5 minutes of inactivity
- **Full dashboard access**:
  - Properties management (CRUD)
  - Reservations management (view, confirm, cancel)
  - Leads management (track sales inquiries)
  - Cities management
  - Blogs management (create, edit, publish)
  - Hero sections management (homepage banners)
  - Statistics and analytics
  - Manual calendar blocking for maintenance

---

## Main Features Implemented

### 1. Properties Management
- **Property Types**: RENT (location) or SALE (vente)
- **Property Categories**: VILLA or APPARTEMENT
- **Property Status**: AVAILABLE, PENDING, SOLD
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Rich property details**:
  - Title, description, price
  - City/location with coordinates (latitude/longitude)
  - Multiple images (up to 30) with thumbnail
  - Video URL support
  - Characteristics: bedrooms, bathrooms, surface area, year built, garage
  - Amenities: balcony, AC, lawn, washing machine, TV, parking, pool, WiFi, kitchen
- **Active/Inactive toggle** for visibility
- **Image hosting** via Cloudinary
- **Filtering**: By type, city, price range, status
- **Pagination**: Configurable page size

### 2. Reservations (Rentals)
- **Rental properties only** (propertyType: RENT)
- **Date range selection** (startDate to endDate)
- **Guest information collection**:
  - Name, email, phone (required)
  - Optional message
  - Optional userId (if logged in)
  - Anonymous guestId for tracking
- **Reservation statuses**:
  - PRE_RESERVED (initial state)
  - CONFIRMED (admin approved)
  - CANCELLED (rejected/cancelled)
  - COMPLETED (past reservation)
- **Automatic price calculation** based on nightly rate
- **Overlapping prevention**: Backend validation ensures no double-bookings
- **Reservation history**: Never deleted, only status changed
- **Calendar blocking**: Admin can manually block dates for maintenance

### 3. Leads (Sales Inquiries)
- **For SALE properties** inquiry tracking
- **Lead information**: Name, email, phone, message
- **Lead statuses**: NEW, CONTACTED, QUALIFIED, CLOSED, LOST
- **Admin notes** field for internal tracking
- **Property reference** linked to each lead

### 4. Calendar & Date Blocking

#### Overlapping Date Constraint
- **Application-level validation** prevents reservation conflicts
- Logic checks for date range overlaps:
  ```
  WHERE startDate <= requestedEndDate
  AND endDate >= requestedStartDate
  ```
- Only CONFIRMED and PRE_RESERVED reservations block dates
- CANCELLED reservations do not block calendar

#### Admin Manual Blocking
- **BlockedDate model** for maintenance/repairs
- Fields: startDate, endDate, reason
- Blocks dates without creating a reservation
- Indexed for performance

### 5. Cities Management
- **City catalog** for property locations
- Fields: name, slug (unique)
- **Slug-based routing** for SEO
- Cities linked to properties (restrict deletion if in use)

### 6. Blog System
- **Rich text editor** (Tiptap) with:
  - Text formatting (bold, italic, strikethrough)
  - Headings (H1, H2, H3)
  - Lists (bullet, numbered)
  - Text alignment
  - Image embedding (Cloudinary URLs)
  - YouTube video embedding
  - Hyperlinks
  - Text color customization
- **SEO fields**: metaTitle, metaDescription
- **Draft/Publish workflow**: isPublished flag
- **Slug-based URLs** for blog posts
- **Categories** for organization
- **Cover image** support
- **Auto-timestamp**: publishedAt on first publish

### 7. Hero Sections (Homepage)
- **Dynamic homepage banners/sliders**
- Fields: title, subtitle, imageUrl, ctaText, ctaLink
- **Ordering system**: Configurable display order
- **Active/Inactive toggle**
- **Reorder functionality** for admins

### 8. Statistics Dashboard
- **Overview metrics**:
  - Total properties (rentals vs sales)
  - Active reservations
  - Total leads
  - Total revenue
  - Occupancy rate calculation
- **Recent activity**:
  - Recent reservations (last 5-10)
  - Recent leads (last 5-10)
- **Performance analytics**:
  - Top performing properties by revenue
  - Revenue by month
  - Booking counts

---

## Reservation Logic Details

### Rent vs Sale Distinction
- **RENT (Location)**:
  - Uses reservation system
  - Date-based availability
  - Nightly pricing
  - Calendar blocking
  - Guest check-in/check-out dates
- **SALE (Vente)**:
  - Uses lead system
  - No reservations
  - Fixed price
  - Inquiry/contact-based workflow

### Availability Checking
```typescript
// Endpoint: GET /api/properties/:id/availability?startDate=X&endDate=Y
// Returns: { isAvailable: boolean, blockedDates: [] }
```

### Overlapping Prevention
- Database query checks for conflicts before creating reservation
- Validates against both reservations AND admin-blocked dates
- Returns 400 error if dates unavailable

### Reservation Status Flow
```
PRE_RESERVED → CONFIRMED (admin approves)
            → CANCELLED (admin/user cancels)
CONFIRMED → COMPLETED (after endDate passes)
```

### History Retention
- **No deletion**: Reservations are never deleted
- **Status changes only**: Track full history
- **Audit trail**: createdAt, updatedAt timestamps

---

## Authentication & Security

### Registration Flow
1. User provides: name, email, username (optional), password
2. Backend checks email/username uniqueness
3. Password hashed with bcryptjs (10 salt rounds)
4. User created with default role: USER
5. Session created and returned as httpOnly cookie

### Login Flow (Regular User)
1. User provides email/username + password
2. Backend validates credentials
3. Session created with 24-hour expiry
4. Session token returned in httpOnly cookie
5. JWT fallback for backward compatibility

### Admin Login Flow (2FA)
1. **Step 1**: Admin provides credentials
2. Backend generates 6-digit OTP code
3. OTP sent to hardcoded email: `saidiavibe@gmail.com`
4. OTP expires in 10 minutes
5. **Step 2**: Admin enters OTP code
6. Backend validates OTP and marks as used
7. Session created with auto-logout tracking
8. Session token returned

### Session Management
- **Storage**: Database `Session` table
- **Token**: 32-byte random hex string
- **Expiry**: 24 hours from creation
- **Inactivity timeout**: 5 minutes (lastActivity tracking)
- **Auto-cleanup**: Expired sessions can be cleaned periodically

### Password Management
- **Change password**: Requires current password verification
- **Reset password**: 2-step OTP flow
  1. Request reset → OTP sent to email
  2. Submit OTP + new password
- **All sessions invalidated** after password change/reset

### Email Change Flow
1. User requests email change with new email
2. OTP sent to NEW email address
3. User confirms with OTP code
4. Email updated in database

### Security Features
- **httpOnly cookies**: Prevent XSS attacks
- **CORS restrictions**: Only localhost:3000 allowed
- **Password hashing**: bcryptjs with salt rounds
- **OTP expiry**: 10-minute window
- **Session expiry**: 24-hour maximum
- **Inactivity logout**: 5-minute threshold for admins
- **Input validation**: Zod schemas on all endpoints

---

## Dashboard Structure

### Admin Pages (`/dashboard/*`)
All routes under `app/(dashboard)/` require authentication.

#### `/dashboard`
- Overview statistics
- Recent reservations widget
- Recent leads widget
- Top performing properties
- Revenue charts

#### `/dashboard/properties`
- Property list (table view)
- Filter by type, status, city
- Create new property button
- Edit/Delete actions
- `/dashboard/properties/new` - Create property form
- `/dashboard/properties/[id]/edit` - Edit property form

#### `/dashboard/reservations`
- Reservation list (table view)
- Filter by status, property
- Confirm/Cancel actions
- Guest contact information
- Date ranges and pricing

#### `/dashboard/leads`
- Lead list (table view)
- Filter by status
- Update lead status
- Add internal notes
- Contact information display

#### `/dashboard/cities`
- City management (CRUD)
- Slug generation
- Property count per city

#### `/dashboard/blogs`
- Blog post list
- Publish/Unpublish toggle
- `/dashboard/blogs/new` - Create blog with Tiptap editor
- Edit/Delete actions

#### `/dashboard/statistics`
- Detailed analytics
- Revenue reports
- Booking trends
- Property performance metrics

### User Pages
Currently not implemented, but structure exists for:
- `/dashboard/my-reservations` (potential user-facing page)
- `/dashboard/profile` (user profile management)

---

## Database Architecture

### Core Models

#### User
- **Auth fields**: email, username (optional), password (hashed)
- **Role**: USER or ADMIN (enum)
- **Security**: emailVerified, resetToken, resetTokenExp
- **Relations**: properties, blogs, reservations, leads, cities, sales, sessions

#### Session
- **Fields**: userId, token (unique), expiresAt, lastActivity
- **Purpose**: Track active login sessions
- **Cleanup**: Can delete expired sessions periodically
- **Indexed**: userId, token, expiresAt

#### OTPCode
- **Fields**: email, code (6-digit), purpose (enum), expiresAt, used
- **Purposes**: LOGIN, RESET_PASSWORD, CHANGE_EMAIL
- **Lifecycle**: 10-minute expiry, marked as used after verification
- **Indexed**: email, expiresAt

#### City
- **Fields**: name, slug (unique)
- **Relations**: properties
- **Constraints**: Restrict deletion if properties exist

#### Property
- **Identification**: title, description, price
- **Type fields**: propertyType (RENT/SALE), listingType (LOCATION/VENTE), propertyCategory (VILLA/APPARTEMENT)
- **Status**: AVAILABLE, PENDING, SOLD
- **Location**: cityId, address, latitude, longitude
- **Media**: images (array), thumbnail, videoUrl
- **Characteristics**: chambres, sallesDeBain, surface, anneeCons, garage
- **Amenities**: balcon, climatisation, gazon, machineLaver, tv, parking, piscine, wifi, cuisine (all boolean)
- **Management**: isActive, userId (owner)
- **Relations**: city, user, reservations, blockedDates, leads
- **Indexed**: userId, cityId, propertyType, listingType, propertyCategory, status, isActive

#### BlockedDate
- **Fields**: propertyId, startDate, endDate, reason
- **Purpose**: Admin-managed calendar blocking
- **Use case**: Maintenance, repairs, off-season closure
- **Indexed**: propertyId, [startDate, endDate]

#### Reservation
- **Property relation**: propertyId (must be RENT type)
- **Dates**: startDate, endDate
- **Guest info**: guestId (optional), guestName, guestEmail, guestPhone, message
- **Status**: PRE_RESERVED, CONFIRMED, CANCELLED, COMPLETED
- **Pricing**: totalPrice (calculated: days × nightly rate)
- **User tracking**: userId (optional, if logged in)
- **Indexed**: propertyId, userId, guestId, [startDate, endDate], status
- **Constraint**: Application-level overlap prevention

#### Lead
- **Property relation**: propertyId (typically SALE properties)
- **Contact**: name, email, phone, message
- **Status**: NEW, CONTACTED, QUALIFIED, CLOSED, LOST
- **Admin tools**: notes field for internal tracking
- **User tracking**: userId (optional)
- **Indexed**: propertyId, userId, status, createdAt

#### Blog
- **Content**: title, slug (unique), content (HTML from Tiptap), excerpt
- **Media**: coverImage, videoUrl
- **SEO**: metaTitle, metaDescription
- **Organization**: category
- **Publishing**: isPublished (boolean), publishedAt (timestamp)
- **Relations**: userId (author)
- **Indexed**: userId, slug, category, isPublished

#### HeroSection
- **Display**: title, subtitle, imageUrl
- **Action**: ctaText, ctaLink
- **Management**: order (sorting), isActive (visibility)
- **Indexed**: order, isActive

#### Sale
- **Tracking**: propertyId, amount, type (SALE/RENTAL)
- **Status**: completed by default
- **Analytics**: Used for revenue reporting
- **Relations**: userId
- **Indexed**: userId, createdAt

### Relationships Summary
```
User (1) → (N) Property
User (1) → (N) Session
User (1) → (N) Reservation
User (1) → (N) Lead
User (1) → (N) Blog
User (1) → (N) City
User (1) → (N) Sale

City (1) → (N) Property

Property (1) → (N) Reservation
Property (1) → (N) BlockedDate
Property (1) → (N) Lead
```

---

## External Services Configuration

### Cloudinary
- **Usage**: Image and video hosting
- **Integration**: Upload URLs stored in database
- **Property images**: Array of Cloudinary URLs
- **Thumbnails**: Single Cloudinary URL
- **Blog cover images**: Cloudinary URL
- **Hero section images**: Cloudinary URL
- **Video uploads**: Optional videoUrl field

### Email Service (Nodemailer)
- **Purpose**: Send OTP codes, notifications
- **Current state**: Console logging (development)
- **Production setup**: Requires SMTP credentials
- **Email types**:
  - Admin 2FA login codes
  - Password reset codes
  - Email change verification codes
- **Configuration needed**:
  - EMAIL_USER environment variable
  - EMAIL_PASS environment variable
  - SMTP service (Gmail, SendGrid, etc.)

### WhatsApp Integration
- **Use case**: Contact property owners, sales inquiries
- **Implementation**: WhatsApp links (wa.me format)
- **Data**: Phone numbers from leads and reservations

---

## Environment Variables

Required environment variables (`.env` file):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agency_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-minimum-32-characters"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:4000"
PORT=4000

# Node Environment
NODE_ENV="development"

# Email Service (for production)
# EMAIL_USER="your-email@gmail.com"
# EMAIL_PASS="your-app-password"

# Cloudinary (if using direct upload)
# CLOUDINARY_CLOUD_NAME=""
# CLOUDINARY_API_KEY=""
# CLOUDINARY_API_SECRET=""
```

---

## API Routes Structure

### Authentication (`/api/auth`)
- `POST /api/auth/login-step1` - Initial login (credentials)
- `POST /api/auth/login-step2-admin` - Admin OTP verification
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Destroy session
- `GET /api/auth/profile` - Get current user (requires auth)
- `POST /api/auth/request-password-reset` - Request OTP for reset
- `POST /api/auth/reset-password` - Reset with OTP
- `POST /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/request-email-change` - Request email change (requires auth)
- `POST /api/auth/confirm-email-change` - Confirm with OTP (requires auth)

### Properties (`/api/properties`)
- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (requires admin auth)
- `PUT /api/properties/:id` - Update property (requires admin auth)
- `DELETE /api/properties/:id` - Delete property (requires admin auth)
- `GET /api/properties/:id/availability` - Check availability for dates

### Reservations (`/api/reservations`)
- `GET /api/reservations` - List all reservations (requires admin auth)
- `GET /api/reservations/:id` - Get single reservation (requires admin auth)
- `POST /api/reservations` - Create reservation (public or auth)
- `PUT /api/reservations/:id` - Update reservation (requires admin auth)
- `DELETE /api/reservations/:id` - Cancel reservation (requires admin auth)
- `GET /api/reservations/my` - Get user's reservations (requires auth)

### Leads (`/api/leads`)
- `GET /api/leads` - List all leads (requires admin auth)
- `GET /api/leads/:id` - Get single lead (requires admin auth)
- `POST /api/leads` - Create lead (public)
- `PUT /api/leads/:id` - Update lead (requires admin auth)
- `DELETE /api/leads/:id` - Delete lead (requires admin auth)

### Cities (`/api/cities`)
- `GET /api/cities` - List all cities
- `GET /api/cities/:id` - Get single city
- `POST /api/cities` - Create city (requires admin auth)
- `PUT /api/cities/:id` - Update city (requires admin auth)
- `DELETE /api/cities/:id` - Delete city (requires admin auth)

### Blogs (`/api/blogs`)
- `GET /api/blogs` - List blogs (public: published only)
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (requires admin auth)
- `PUT /api/blogs/:id` - Update blog (requires admin auth)
- `DELETE /api/blogs/:id` - Delete blog (requires admin auth)

### Hero Sections (`/api/heroes`)
- `GET /api/heroes` - List hero sections
- `GET /api/heroes/:id` - Get single hero
- `POST /api/heroes` - Create hero (requires admin auth)
- `PUT /api/heroes/:id` - Update hero (requires admin auth)
- `DELETE /api/heroes/:id` - Delete hero (requires admin auth)
- `POST /api/heroes/reorder` - Reorder heroes (requires admin auth)

### Statistics (`/api/stats`)
- `GET /api/stats/dashboard` - Get dashboard stats (requires admin auth)

### Health Check
- `GET /health` - Server health check

---

## Frontend Pages Structure

### Public Pages
- `/` - Homepage with property listings
- `/login` - User/Admin login
- `/register` - User registration
- `/property/[id]` - Property detail page (not implemented yet)

### Dashboard Pages (Authenticated)
Located in `app/(dashboard)/`:
- `/dashboard` - Main dashboard overview
- `/dashboard/properties` - Property management
- `/dashboard/properties/new` - Create property
- `/dashboard/properties/[id]/edit` - Edit property
- `/dashboard/reservations` - Reservation management
- `/dashboard/leads` - Lead management
- `/dashboard/cities` - City management
- `/dashboard/blogs` - Blog management
- `/dashboard/blogs/new` - Create blog
- `/dashboard/statistics` - Detailed analytics

---

## Key Components

### UI Components (`components/ui/`)
- `Button.tsx` - Reusable button with variants (primary, ghost, danger)
- `Card.tsx` - Card container with header
- `Input.tsx` - Form input field
- `Table.tsx` - Data table component
- `Toast.tsx` - Notification/toast messages

### Form Components (`components/forms/`)
- `PropertyForm.tsx` - Property create/edit form with all fields

### Layout Components (`components/layout/`)
- `DashboardLayout.tsx` - Dashboard wrapper with sidebar
- `Header.tsx` - Top navigation
- `Sidebar.tsx` - Dashboard navigation menu

### Editor Components (`components/editor/`)
- `TiptapEditor.tsx` - Rich text editor with toolbar

---

## Current Project Status

### Completed Features ✅
- User authentication system (register, login, logout)
- Admin 2FA with OTP via email
- Session management with auto-logout
- Password reset and change functionality
- Property CRUD operations
- Property filtering and pagination
- City management
- Reservation system with overlap prevention
- Lead management system
- Blog system with rich text editor
- Hero section management
- Statistics dashboard
- Calendar availability checking
- Manual date blocking for admins
- Image hosting integration (Cloudinary)
- Database schema with Prisma
- API endpoints for all features
- Admin dashboard UI
- Homepage with property listings

### Pending/Incomplete Features ⚠️
- **Email service**: Currently console-logging OTP codes (needs Nodemailer configuration)
- **Property detail page**: Frontend page not implemented yet (`/property/[id]`)
- **User-facing dashboard**: No reservation history page for regular users
- **Image upload UI**: Manual Cloudinary URL entry (could add upload widget)
- **Cloudinary direct upload**: Currently using URL strings
- **Advanced search**: More filter options (amenities, date ranges)
- **Property reviews**: No review/rating system implemented
- **Payment integration**: No payment processing
- **Booking confirmation emails**: Email service pending
- **WhatsApp integration**: Links exist but not fully integrated
- **SEO optimization**: Meta tags not fully implemented
- **Localization**: Only French language currently
- **Mobile optimization**: Responsive design not fully tested

### Technical Debt 📝
- OTP emails currently log to console (development mode)
- JWT fallback authentication (should migrate fully to sessions)
- No automated session cleanup job (requires cron or scheduler)
- No image upload interface (manual Cloudinary URL entry)
- Limited error handling on frontend
- No loading states in some components
- No unit/integration tests implemented
- No API documentation (Swagger/OpenAPI)

---

## Development Workflow

### Running the Project
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development servers (both Next.js and Express)
npm run dev

# Run Next.js only
npm run dev:next

# Run Express server only
npm run dev:server

# Database management
npm run prisma:studio    # Open Prisma Studio
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
```

### Build & Production
```bash
# Build both frontend and backend
npm run build

# Start production servers
npm start
```

### Ports
- **Next.js**: http://localhost:3000
- **Express API**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555

---

## Notes for AI Continuation

1. **Admin Email**: The admin OTP is hardcoded to `saidiavibe@gmail.com` in [auth.service.ts:35](server/services/auth.service.ts#L35). This should be configurable via environment variable.

2. **Reservation Overlap Logic**: The overlap detection is in [reservation.service.ts:72-83](server/services/reservation.service.ts#L72-L83). It checks for ANY overlap between requested dates and existing CONFIRMED/PRE_RESERVED reservations.

3. **Session Cleanup**: There's a method `cleanExpiredSessions()` in [session.service.ts:69-78](server/services/session.service.ts#L69-L78) but it's not called automatically. Consider adding a cron job or scheduled task.

4. **OTP Email Sending**: The actual email sending code is commented out in [otp.service.ts:85-110](server/services/otp.service.ts#L85-L110). Uncomment and configure with SMTP credentials for production.

5. **File Upload**: The project uses Cloudinary but expects manual URL entry. Consider adding the Cloudinary upload widget or a file upload API endpoint.

6. **Validation**: All input validation uses Zod schemas located in `lib/validators/`. Always validate on both client and server.

7. **Database Migrations**: Use `prisma migrate dev` for development changes. The schema is in [prisma/schema.prisma](prisma/schema.prisma).

8. **TypeScript Types**: All TypeScript interfaces are in [types/index.ts](types/index.ts). Keep this file synced with Prisma schema.

9. **Error Handling**: Custom error class `AppError` is in [server/middlewares/error.middleware.ts](server/middlewares/error.middleware.ts). Use it for consistent error responses.

10. **CORS Configuration**: Currently allows only `localhost:3000`. Update in [server/index.ts:21-24](server/index.ts#L21-L24) for production domains.

---

## Moroccan Real Estate Context

This platform is designed specifically for the Moroccan real estate market with these considerations:

- **Currency**: Likely MAD (Moroccan Dirham) - not explicitly set but implied
- **Language**: French is primary language in UI (can add Arabic/English later)
- **Property Types**: Villa and Appartement are the two main categories
- **Rental Market**: Nightly rentals (similar to Airbnb model)
- **Sales Market**: Traditional real estate sales with lead management
- **Cities**: Major Moroccan cities expected (Marrakech, Casablanca, Rabat, etc.)
- **Contact Method**: WhatsApp is preferred communication channel in Morocco

---

**Document Version**: 1.0
**Last Updated**: December 2024
**Project Status**: Development Phase - Core Features Complete
