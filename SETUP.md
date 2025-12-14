# Saidia Bay - Quick Setup Guide

This guide will help you get the Saidia Bay real estate platform up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn package manager
- Git

## Quick Start

### Option 1: Docker Compose (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/red-jen/saidiabay.git
cd saidiabay

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 2: Manual Setup

#### 1. Clone and Setup Database

```bash
# Clone the repository
git clone https://github.com/red-jen/saidiabay.git
cd saidiabay

# Create PostgreSQL database
createdb saidiabay

# Or using psql
psql -U postgres
CREATE DATABASE saidiabay;
\q
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Update DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET

# Build and start the backend
npm run build
npm start

# For development with auto-reload
npm run dev
```

The backend will automatically create all necessary database tables on first run.

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local if needed (default values should work)

# Start the development server
npm run dev

# For production build
npm run build
npm start
```

## Creating Your First Admin Account

Once the backend is running, create an admin account by registering the first user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@saidiabay.com",
    "password": "SecurePassword123!",
    "name": "Admin User"
  }'
```

**Note:** The first registered user automatically becomes an admin. Subsequent registrations will be regular users.

Save the returned token and use it to authenticate admin requests.

## Accessing the Application

- **Homepage**: http://localhost:3000
- **Properties**: http://localhost:3000/properties
- **Contact**: http://localhost:3000/contact
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard (after login)

## Adding Sample Properties

Log in to the admin panel at http://localhost:3000/admin/login with your credentials, then:

1. Navigate to "Manage Properties"
2. Click "Add Property"
3. Fill in the property details
4. Mark some properties as "Featured" to show them on the homepage

## Testing the API

### Get All Properties
```bash
curl http://localhost:5000/api/properties
```

### Get Featured Properties
```bash
curl http://localhost:5000/api/properties/featured
```

### Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "start_date": "2024-01-01",
    "end_date": "2024-01-07",
    "message": "Looking forward to staying here!"
  }'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "subject": "Property Inquiry",
    "message": "I am interested in learning more about your properties."
  }'
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify PostgreSQL is running: `pg_isready`
2. Check your database credentials in `backend/.env`
3. Ensure the database exists: `psql -l | grep saidiabay`

### Port Already in Use

If ports 3000 or 5000 are already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change the port with `npm run dev -- -p 3001`
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` accordingly

### Build Errors

If you encounter build errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
```

## Next Steps

1. Customize the branding and colors in `frontend/app/globals.css`
2. Add your own property images
3. Configure email notifications for bookings and contacts
4. Set up a production database
5. Deploy to your hosting provider

## Support

For issues or questions:
- Check the main README.md for detailed documentation
- Review the API endpoints documentation
- Open an issue on GitHub

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` in backend/.env to a strong random string
2. Use a production PostgreSQL database
3. Set up HTTPS/SSL certificates
4. Configure proper CORS settings
5. Set up database backups
6. Consider using a process manager like PM2 for the backend
7. Build and deploy the frontend to a CDN or hosting service

Happy building! 🏠
