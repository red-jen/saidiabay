# SaidiaBay Real Estate Platform

A professional web platform dedicated to the rental and sale of apartments and real estate properties. Built with Next.js, Express.js, and PostgreSQL.

## 🏗️ Architecture

```
saidiabay/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   └── package.json
│
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # API client & utilities
│   │   ├── store/         # Zustand state management
│   │   └── types/         # TypeScript types
│   └── package.json
│
└── docker-compose.yml      # PostgreSQL & pgAdmin setup
```

## 🚀 Features

- **Property Management**: List, search, and filter properties for rent or sale
- **User Authentication**: JWT-based auth with admin and client roles
- **Reservation System**: Pre-reservation requests with availability checking
- **Blog/Content Management**: SEO-optimized blog posts
- **Ad Management**: Banner ads with click tracking
- **Responsive Design**: Mobile-first, SEO-optimized frontend
- **Admin Dashboard**: Comprehensive content management

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcrypt

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ (or Docker)
- npm or yarn

## 🔧 Installation

### 1. Clone and Setup

```bash
cd saidiabay
```

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port `5432`
- pgAdmin on port `5050` (optional, for DB management)

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saidiabay
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=SaidiaBay Real Estate
```

Start the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get property by ID or slug
- `POST /api/properties` - Create property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)
- `PATCH /api/properties/:id/status` - Update status (admin)

### Reservations
- `GET /api/reservations/check-availability` - Check dates availability
- `POST /api/reservations` - Create reservation request
- `GET /api/reservations/my-reservations` - Get user's reservations
- `GET /api/reservations` - Get all reservations (admin)
- `PATCH /api/reservations/:id/confirm` - Confirm reservation (admin)
- `PATCH /api/reservations/:id/cancel` - Cancel reservation

### Blog
- `GET /api/blog` - Get all published posts
- `GET /api/blog/recent` - Get recent posts
- `GET /api/blog/:id` - Get post by ID or slug
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)
- `PATCH /api/blog/:id/publish` - Publish post (admin)

### Ads
- `GET /api/ads/active` - Get active ads
- `POST /api/ads/:id/click` - Track ad click
- `GET /api/ads` - Get all ads (admin)
- `POST /api/ads` - Create ad (admin)
- `PUT /api/ads/:id` - Update ad (admin)
- `DELETE /api/ads/:id` - Delete ad (admin)

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🗄️ Database Models

Based on the class diagram:

- **User**: id, name, email, phone, role, password
- **Property**: id, title, description, price, type, status, location, etc.
- **Reservation**: id, startDate, endDate, status, guestInfo
- **BlogPost**: id, title, content, status, slug, tags
- **Ad**: id, imageUrl, link, active, position

## 🔐 Security Features

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Helmet for HTTP headers security
- CORS configuration
- Role-based access control (admin/client)
- Input validation

## 🎨 Frontend Pages

- `/` - Homepage with hero, featured properties, services
- `/properties` - Property listing with filters
- `/properties/[slug]` - Property detail page
- `/contact` - Contact form
- `/blog` - Blog listing
- `/blog/[slug]` - Blog post detail
- `/login` - User login
- `/register` - User registration
- `/admin` - Admin dashboard (protected)

## 📱 Responsive Design

The platform is fully responsive with:
- Mobile-first approach
- Tailwind CSS breakpoints
- Optimized images
- Touch-friendly navigation

## 🔍 SEO Features

- Next.js metadata API
- Open Graph tags
- Twitter cards
- Semantic HTML
- Sitemap support
- SEO-friendly URLs (slugs)

## 🚢 Deployment

### Backend
```bash
cd backend
npm run build  # if using TypeScript
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📄 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
