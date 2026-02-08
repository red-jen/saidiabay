# 🏠 Saidiabay - Real Estate Platform

A comprehensive real estate platform for the Moroccan market, handling both property rentals (location) and property sales (vente). Built with Next.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [Development](#development)

## ✨ Features

### Property Management
- **Dual Listing Types**: Support for both rentals (LOCATION) and sales (VENTE)
- **Property Categories**: Villas and Appartements
- **Rich Property Details**: Multiple images, videos, amenities, characteristics
- **Advanced Filtering**: By type, city, price range, status
- **Image Hosting**: Cloudinary integration for media management

### Reservation System
- **Date-based Bookings**: Calendar availability checking
- **Overlap Prevention**: Automatic conflict detection
- **Guest Management**: Support for both authenticated and anonymous users
- **Status Tracking**: PRE_RESERVED → CONFIRMED → COMPLETED
- **Manual Date Blocking**: Admin can block dates for maintenance

### Lead Management
- **Sales Inquiries**: Track potential buyers for sale properties
- **Status Pipeline**: NEW → CONTACTED → QUALIFIED → CLOSED/LOST
- **Internal Notes**: Admin notes for lead tracking

### Authentication & Security
- **User Registration & Login**: Email/username authentication
- **Admin 2FA**: Two-factor authentication via email OTP
- **Session Management**: Secure session-based auth with auto-logout
- **Password Management**: Reset and change password functionality
- **Role-based Access**: USER and ADMIN roles

### Content Management
- **Blog System**: Rich text editor with Tiptap
- **Hero Sections**: Dynamic homepage banners/sliders
- **City Management**: SEO-friendly city catalog
- **SEO Optimization**: Meta tags and slug-based URLs

### Analytics & Statistics
- **Dashboard Overview**: Key metrics and KPIs
- **Revenue Tracking**: Property performance analytics
- **Booking Trends**: Occupancy rates and booking statistics

## 🛠 Tech Stack

### Frontend
- **Next.js 14.0.4** (App Router)
- **React 18.2.0**
- **TypeScript 5.3.3**
- **Tailwind CSS 3.4.0**
- **Tiptap Editor** (Rich text editing)

### Backend
- **Node.js** with **Express 4.18.2**
- **TypeScript**
- **Prisma 5.8.0** (ORM)
- **PostgreSQL** (Database)

### Authentication & Security
- **JWT** (jsonwebtoken) with httpOnly cookies
- **bcryptjs** for password hashing
- **Session-based authentication**
- **OTP verification** for admin 2FA

### External Services
- **Cloudinary** (Image/video hosting)
- **Nodemailer** (Email service)

### Validation
- **Zod** (Schema validation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for image hosting)
- SMTP credentials (for email service)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saidiabay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
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
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   
   # Cloudinary (optional - if using direct upload)
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Push schema to database
   npm run prisma:push
   
   # (Optional) Seed the database
   npm run prisma:seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both:
   - Next.js frontend on `http://localhost:3000`
   - Express backend on `http://localhost:4000`

## 📁 Project Structure

```
saidiabay/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages (protected)
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── editor/           # Tiptap editor
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                   # Utilities and helpers
│   ├── auth/             # Authentication utilities
│   ├── prisma.ts         # Prisma client
│   ├── utils/            # Utility functions
│   └── validators/       # Zod validation schemas
├── prisma/                # Database schema
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seed file
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Express middlewares
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── index.ts          # Server entry point
└── types/                 # TypeScript type definitions
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both Next.js and Express servers concurrently |
| `npm run dev:next` | Start only Next.js development server |
| `npm run dev:server` | Start only Express development server |
| `npm run build` | Build both frontend and backend for production |
| `npm start` | Start production servers |
| `npm run prisma:push` | Push Prisma schema to database |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run prisma:generate` | Generate Prisma Client |

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login-step1` - Initial login (credentials)
- `POST /api/auth/login-step2-admin` - Admin OTP verification
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user
- `POST /api/auth/request-password-reset` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/change-password` - Change password (authenticated)

### Properties (`/api/properties`)
- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)
- `GET /api/properties/:id/availability` - Check availability for dates

### Reservations (`/api/reservations`)
- `GET /api/reservations` - List all reservations (admin only)
- `GET /api/reservations/:id` - Get single reservation
- `POST /api/reservations` - Create reservation (public)
- `PUT /api/reservations/:id` - Update reservation (admin only)
- `GET /api/reservations/my` - Get user's reservations (authenticated)

### Leads (`/api/leads`)
- `GET /api/leads` - List all leads (admin only)
- `POST /api/leads` - Create lead (public)
- `PUT /api/leads/:id` - Update lead (admin only)

### Cities (`/api/cities`)
- `GET /api/cities` - List all cities
- `POST /api/cities` - Create city (admin only)
- `PUT /api/cities/:id` - Update city (admin only)
- `DELETE /api/cities/:id` - Delete city (admin only)

### Blogs (`/api/blogs`)
- `GET /api/blogs` - List published blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)

### Statistics (`/api/stats`)
- `GET /api/stats/dashboard` - Get dashboard statistics (admin only)

## 👥 User Roles

### Guest User
- Browse all published properties
- Filter by listing type (LOCATION/VENTE)
- Make reservations without account
- Submit leads (sales inquiries)

### Authenticated User (USER)
- All guest capabilities
- Register and login
- View reservation history
- Manage profile

### Admin (ADMIN)
- **Two-Factor Authentication**: Email OTP required
- **Auto-logout**: Session expires after 5 minutes of inactivity
- **Full Dashboard Access**:
  - Properties management (CRUD)
  - Reservations management
  - Leads management
  - Cities management
  - Blogs management
  - Hero sections management
  - Statistics and analytics
  - Manual calendar blocking

## 🗄 Database Schema

### Core Models
- **User**: Authentication and user management
- **Session**: Active login sessions
- **OTPCode**: One-time passwords for 2FA
- **Property**: Property listings (rentals and sales)
- **Reservation**: Rental bookings
- **Lead**: Sales inquiries
- **City**: City catalog
- **Blog**: Blog posts
- **HeroSection**: Homepage banners
- **BlockedDate**: Admin-managed date blocks

See `prisma/schema.prisma` for complete schema definition.

## 💻 Development

### Running in Development Mode

```bash
# Start both servers with hot reload
npm run dev
```

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Validators**: Zod schemas for input validation
- **Middlewares**: Authentication, error handling, validation
- **Types**: TypeScript interfaces in `types/index.ts`

### Important Notes

1. **Admin Email**: Admin OTP is currently hardcoded to `saidiavibe@gmail.com`. Consider making this configurable via environment variable.

2. **Email Service**: OTP emails are currently logged to console in development. Configure SMTP credentials for production.

3. **Session Cleanup**: Implement a cron job or scheduled task to clean expired sessions periodically.

4. **CORS**: Currently configured for `localhost:3000`. Update for production domains.

5. **Image Upload**: Currently uses manual Cloudinary URL entry. Consider adding upload widget or API endpoint.

## 📝 License

This project is proprietary software.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.

---

**Built with ❤️ for the Moroccan real estate market**

