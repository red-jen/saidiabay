# Saidia Bay - Real Estate Platform

A modern, SEO-optimized real estate platform built with Next.js, Express, React, and PostgreSQL. This platform allows visitors to explore properties, pre-reserve with a smart calendar, and contact the administrator, while providing the owner with a secure and powerful admin dashboard to manage listings, bookings, content, and visibility.

## Features

### Public Features
- 🏠 Browse properties with filtering (type, city, status)
- 🔍 SEO-optimized property listings for better search visibility
- 📱 Fully responsive design for all devices
- 📅 Smart booking system with calendar integration
- 📧 Contact form for lead generation
- ⭐ Featured properties showcase
- 📍 Detailed property pages with images and amenities

### Admin Features
- 🔐 Secure authentication system
- 📊 Dashboard with statistics overview
- ✏️ Property management (Create, Read, Update, Delete)
- 📋 Booking management and tracking
- 👥 Contact/lead management
- 🎯 Mark properties as featured

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios

## Project Structure

```
saidiabay/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Database and configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth and error handling
│   │   └── index.ts        # Server entry point
│   └── package.json
├── frontend/                # Next.js application
│   ├── app/                # Next.js app directory
│   │   ├── properties/     # Property pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── contact/        # Contact page
│   │   └── about/          # About page
│   ├── components/         # Reusable components
│   ├── lib/                # API utilities
│   ├── types/              # TypeScript types
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/red-jen/saidiabay.git
cd saidiabay
```

2. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run build
npm start
```

3. Set up the frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if your backend URL is different
npm run dev
```

4. Set up the database:
The database will be automatically initialized when the backend starts.

### Environment Variables

#### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saidiabay
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-this-in-production
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Admin: http://localhost:3000/admin/login

### Creating an Admin Account

To create the first admin account, use the registration endpoint or insert directly into the database:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@saidiabay.com","password":"yourpassword","name":"Admin"}'
```

## API Endpoints

### Public Endpoints
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/bookings` - Create a booking
- `POST /api/contacts` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/contacts` - Get all contacts
- `PUT /api/contacts/:id` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact

## SEO Optimization

The platform is optimized for search engines with:
- Server-side rendering (SSR) for property pages
- Optimized meta tags and descriptions
- Semantic HTML structure
- Fast page load times
- Mobile-responsive design
- Sitemap generation ready

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Support

For support, email info@saidiabay.com or open an issue in the repository.
