# Saidia Bay Real Estate - Frontend

A modern, professional real estate platform built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Property Listings**: Browse properties with advanced filtering and search
- **Property Details**: Detailed property pages with image galleries and reservation forms
- **User Authentication**: Login and registration with JWT tokens
- **Reservation System**: Pre-reserve rental properties with date selection
- **Responsive Design**: Mobile-first, fully responsive UI
- **SEO Optimized**: Server-side rendering with metadata for better SEO
- **Modern UI**: Clean, professional design based on Zillow and Compass

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see backend README)

## 🔧 Installation

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **Environment Setup**:

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Run Development Server**:
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── properties/        # Properties listing & details
│   │   ├── contact/           # Contact page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── contact/           # Contact form
│   │   ├── home/              # Home page sections
│   │   ├── layout/            # Header & Footer
│   │   └── properties/        # Property components
│   ├── lib/                   # Utilities
│   │   └── api.ts            # API client & endpoints
│   ├── store/                 # Zustand stores
│   │   └── authStore.ts      # Auth state management
│   └── types/                 # TypeScript types
│       └── index.ts          # Shared interfaces
├── public/                    # Static assets
├── tailwind.config.js        # Tailwind configuration
└── next.config.js            # Next.js configuration
```

## 🎨 Design System

### Colors

- **Primary (Dark Blue)**: `#0F2A44` - Buttons, headers, links
- **Secondary (Gray)**: `#6B7280` - Secondary text, icons
- **Accent (Gold)**: `#C9A24D` - Price highlights, important CTAs
- **Background**: `#F9FAFB` - Page backgrounds
- **Text**: `#111827` - Primary text

### Typography

- **Headings**: Poppins (600-800 weight)
- **Body**: Inter (400-600 weight)

### Components

- **Buttons**: Rounded (rounded-lg), with shadow on hover
- **Cards**: White background, rounded-xl, shadow-sm
- **Inputs**: Border, rounded-lg, focus ring
- **Badges**: Rounded-full, colored by status

## 🔑 Key Pages

### Home Page (`/`)
- Hero section with property search
- Featured properties grid
- About section
- Services overview
- Call-to-action section

### Properties (`/properties`)
- Advanced filters (type, listing type, price, location, bedrooms)
- Property grid with cards
- Pagination
- Sorting options

### Property Detail (`/properties/[slug]`)
- Image gallery
- Property information and features
- Reservation form (for rentals)
- Contact information
- Related properties (coming soon)

### Authentication
- **Login** (`/login`): Email/password authentication
- **Register** (`/register`): User registration with validation

### Contact (`/contact`)
- Contact form with validation
- Contact information display
- Map integration (placeholder)

## 🔐 Authentication Flow

1. User logs in via `/login` or registers via `/register`
2. JWT token is stored in cookies (7-day expiry)
3. Token is automatically attached to API requests
4. Protected routes redirect to login if not authenticated
5. Admin users can access admin dashboard (coming soon)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
# Build image
docker build -t saidiabay-frontend .

# Run container
docker run -p 3000:3000 saidiabay-frontend
```

## 🧪 Development Tips

1. **Hot Reload**: Changes auto-reload in development
2. **TypeScript**: Use strict typing for better code quality
3. **Components**: Keep components small and reusable
4. **API Calls**: Use the centralized API client in `lib/api.ts`
5. **Styling**: Use Tailwind utility classes, avoid custom CSS

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Common Issues

### API Connection Error
- Ensure backend is running on `http://localhost:5000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Image Not Loading
- Images must be in `/public` directory
- Use Next.js `Image` component for optimization

### Authentication Issues
- Clear cookies if experiencing login issues
- Check JWT token expiry (default 7 days)

## 🔮 Coming Soon

- [ ] User dashboard
- [ ] Admin panel
- [ ] Blog system
- [ ] Advanced search with map
- [ ] Favorites/Wishlist
- [ ] Property comparison
- [ ] Email notifications
- [ ] Multi-language support (Arabic/French)

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, contact: contact@saidiabay.com

