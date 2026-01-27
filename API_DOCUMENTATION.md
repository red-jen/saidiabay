# 📚 SaidiaBay Backend API Documentation

> **Base URL:** `http://localhost:4000`  
> **API Prefix:** `/api`

---

## 📋 Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Properties](#properties)
4. [Cities](#cities)
5. [Reservations](#reservations)
6. [Leads](#leads)
7. [Blogs](#blogs)
8. [Hero Sections](#hero-sections)
9. [Statistics](#statistics)
10. [Data Types & Enums](#data-types--enums)

---

## 🏥 Health Check

### Check API Status
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T12:00:00.000Z",
  "service": "Plateforme Immobilière API"
}
```

---

## 🔐 Authentication

**Base Path:** `/api/auth`

### Register a New User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "string (min 2 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars, 1 uppercase, 1 lowercase, 1 number)"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "USER"
  }
}
```

---

### Login (Step 1)
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "identifier": "string (email or username)",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "requiresOtp": true
}
```

---

### Login - Verify OTP (Step 2 for Admin)
```
POST /api/auth/login/verify-otp
```

**Request Body:**
```json
{
  "email": "string",
  "otpCode": "string (6 digits)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ADMIN"
  },
  "token": "string (JWT or session token)"
}
```

---

### Get User Profile
```
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```
or via HTTP-only cookie

**Response:** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "role": "USER | ADMIN",
  "createdAt": "string (ISO date)"
}
```

---

### Logout
```
POST /api/auth/logout
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Request Password Reset
```
POST /api/auth/forgot-password/request
```

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

---

### Reset Password with OTP
```
POST /api/auth/forgot-password/reset
```

**Request Body:**
```json
{
  "email": "string",
  "otpCode": "string (6 digits)",
  "newPassword": "string (min 8 chars)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Change Password (Authenticated)
```
POST /api/auth/profile/change-password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

### Request Email Change
```
POST /api/auth/profile/request-email-change
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newEmail": "string (valid email)"
}
```

---

### Confirm Email Change
```
POST /api/auth/profile/confirm-email-change
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newEmail": "string",
  "otpCode": "string"
}
```

---

### Request Phone Change
```
POST /api/auth/profile/request-phone-change
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newPhone": "string"
}
```

---

### Confirm Phone Change
```
POST /api/auth/profile/confirm-phone-change
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newPhone": "string",
  "otpCode": "string"
}
```

---

## 🏠 Properties

**Base Path:** `/api/properties`

### Get All Properties (Public)
```
GET /api/properties
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `cityId` | string | Filter by city ID |
| `propertyType` | string | `RENT` or `SALE` |
| `listingType` | string | `LOCATION` or `VENTE` |
| `propertyCategory` | string | `VILLA` or `APPARTEMENT` |
| `status` | string | `AVAILABLE`, `PENDING`, `SOLD` |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `chambres` | number | Number of bedrooms |

**Response:** `200 OK`
```json
{
  "properties": [
    {
      "id": "string",
      "title": "string",
      "description": "string | null",
      "price": 0,
      "propertyType": "RENT | SALE",
      "listingType": "LOCATION | VENTE",
      "propertyCategory": "VILLA | APPARTEMENT",
      "status": "AVAILABLE | PENDING | SOLD",
      "cityId": "string",
      "city": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "address": "string",
      "latitude": 0,
      "longitude": 0,
      "images": ["string"],
      "thumbnail": "string",
      "videoUrl": "string | null",
      "chambres": 0,
      "sallesDeBain": 0,
      "surface": 0,
      "anneeCons": 0,
      "garage": 0,
      "balcon": false,
      "climatisation": false,
      "gazon": false,
      "machineLaver": false,
      "tv": false,
      "parking": false,
      "piscine": false,
      "wifi": false,
      "cuisine": false,
      "isActive": true,
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### Get Property by ID (Public)
```
GET /api/properties/:id
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Property ID (cuid) |

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "price": 0,
  "propertyType": "RENT | SALE",
  "listingType": "LOCATION | VENTE",
  "propertyCategory": "VILLA | APPARTEMENT",
  "status": "AVAILABLE | PENDING | SOLD",
  "cityId": "string",
  "city": {
    "id": "string",
    "name": "string",
    "slug": "string"
  },
  "address": "string",
  "latitude": 0,
  "longitude": 0,
  "images": ["string"],
  "thumbnail": "string",
  "videoUrl": "string | null",
  "chambres": 0,
  "sallesDeBain": 0,
  "surface": 0,
  "anneeCons": 0,
  "garage": 0,
  "balcon": false,
  "climatisation": false,
  "gazon": false,
  "machineLaver": false,
  "tv": false,
  "parking": false,
  "piscine": false,
  "wifi": false,
  "cuisine": false,
  "isActive": true,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

---

### Check Property Availability (Public)
```
GET /api/properties/:id/availability
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Property ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | string | Start date (ISO format) |
| `endDate` | string | End date (ISO format) |

**Response:** `200 OK`
```json
{
  "available": true,
  "blockedDates": [
    {
      "startDate": "string",
      "endDate": "string",
      "reason": "string | null"
    }
  ],
  "reservations": [
    {
      "startDate": "string",
      "endDate": "string"
    }
  ]
}
```

---

### Create Property (Admin Only)
```
POST /api/properties
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (min 5 chars)",
  "description": "string (optional)",
  "price": 0,
  "propertyType": "RENT | SALE",
  "listingType": "LOCATION | VENTE",
  "propertyCategory": "VILLA | APPARTEMENT",
  "status": "AVAILABLE | PENDING | SOLD (optional)",
  "cityId": "string (cuid)",
  "address": "string (min 5 chars)",
  "latitude": 0,
  "longitude": 0,
  "images": ["string (URLs, max 30)"],
  "thumbnail": "string (URL, optional)",
  "videoUrl": "string (URL, optional)",
  "chambres": 0,
  "sallesDeBain": 0,
  "surface": 0,
  "anneeCons": 0,
  "garage": 0,
  "balcon": false,
  "climatisation": false,
  "gazon": false,
  "machineLaver": false,
  "tv": false,
  "parking": false,
  "piscine": false,
  "wifi": false,
  "cuisine": false,
  "isActive": true
}
```

**Response:** `201 Created`

---

### Update Property (Admin Only)
```
PUT /api/properties/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as create (all fields optional)

**Response:** `200 OK`

---

### Delete Property (Admin Only)
```
DELETE /api/properties/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## 🏙️ Cities

**Base Path:** `/api/cities`

### Get All Cities (Public)
```
GET /api/cities
```

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

---

### Get City by ID (Admin)
```
GET /api/cities/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Create City (Admin Only)
```
POST /api/cities
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (min 2 chars)",
  "slug": "string (lowercase with hyphens)"
}
```

---

### Update City (Admin Only)
```
PUT /api/cities/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as create (all fields optional)

---

### Delete City (Admin Only)
```
DELETE /api/cities/:id
```

**Headers:** `Authorization: Bearer <token>`

---

## 📅 Reservations

**Base Path:** `/api/reservations`

### Create Reservation (Public)
```
POST /api/reservations
```

**Request Body:**
```json
{
  "propertyId": "string (cuid)",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date, must be after startDate)",
  "guestName": "string (min 2 chars)",
  "guestEmail": "string (valid email)",
  "guestPhone": "string (min 10 chars)",
  "message": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "propertyId": "string",
  "startDate": "string",
  "endDate": "string",
  "guestName": "string",
  "guestEmail": "string",
  "guestPhone": "string",
  "message": "string | null",
  "status": "PRE_RESERVED",
  "totalPrice": 0,
  "createdAt": "string"
}
```

---

### Get All Reservations (Admin)
```
GET /api/reservations
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | `PRE_RESERVED`, `CONFIRMED`, `CANCELLED` |
| `propertyId` | string | Filter by property |

---

### Get My Reservations (Authenticated User)
```
GET /api/reservations/my
```

**Headers:** `Authorization: Bearer <token>`

---

### Get Reservation by ID (Admin)
```
GET /api/reservations/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Update Reservation Status (Admin)
```
PUT /api/reservations/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "PRE_RESERVED | CONFIRMED | CANCELLED",
  "notes": "string (optional)"
}
```

---

### Cancel Reservation (Authenticated)
```
POST /api/reservations/:id/cancel
```

**Headers:** `Authorization: Bearer <token>`

---

## 📩 Leads

**Base Path:** `/api/leads`

### Create Lead (Public)
```
POST /api/leads
```

**Request Body:**
```json
{
  "propertyId": "string (cuid)",
  "name": "string (min 2 chars)",
  "email": "string (valid email)",
  "phone": "string (min 10 chars)",
  "message": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "propertyId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string | null",
  "status": "NEW",
  "createdAt": "string"
}
```

---

### Get All Leads (Admin)
```
GET /api/leads
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | `NEW`, `CONTACTED`, `QUALIFIED`, `CLOSED`, `LOST` |
| `propertyId` | string | Filter by property |

---

### Get Lead by ID (Admin)
```
GET /api/leads/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Update Lead (Admin)
```
PUT /api/leads/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "NEW | CONTACTED | QUALIFIED | CLOSED | LOST",
  "notes": "string (optional)"
}
```

---

### Delete Lead (Admin)
```
DELETE /api/leads/:id
```

**Headers:** `Authorization: Bearer <token>`

---

## 📝 Blogs

**Base Path:** `/api/blogs`

### Get All Blogs (Public)
```
GET /api/blogs
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `category` | string | Filter by category |
| `isPublished` | boolean | Filter published only |

**Response:** `200 OK`
```json
{
  "blogs": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "excerpt": "string | null",
      "coverImage": "string | null",
      "category": "string",
      "isPublished": true,
      "publishedAt": "string | null",
      "createdAt": "string",
      "user": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### Get Blog by Slug (Public)
```
GET /api/blogs/:slug
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "content": "string (HTML)",
  "excerpt": "string | null",
  "coverImage": "string | null",
  "videoUrl": "string | null",
  "category": "string",
  "isPublished": true,
  "publishedAt": "string | null",
  "metaTitle": "string | null",
  "metaDescription": "string | null",
  "createdAt": "string",
  "updatedAt": "string",
  "user": {
    "id": "string",
    "name": "string"
  }
}
```

---

### Create Blog (Admin)
```
POST /api/blogs
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (min 5 chars)",
  "slug": "string (lowercase with hyphens)",
  "content": "string (min 50 chars, HTML)",
  "excerpt": "string (optional)",
  "coverImage": "string (URL, optional)",
  "videoUrl": "string (URL, optional)",
  "category": "string (min 2 chars)",
  "isPublished": false,
  "metaTitle": "string (optional)",
  "metaDescription": "string (optional)"
}
```

---

### Update Blog (Admin)
```
PUT /api/blogs/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Delete Blog (Admin)
```
DELETE /api/blogs/:id
```

**Headers:** `Authorization: Bearer <token>`

---

## 🖼️ Hero Sections

**Base Path:** `/api/heroes`

### Get All Heroes (Public)
```
GET /api/heroes
```

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "title": "string",
    "subtitle": "string | null",
    "imageUrl": "string",
    "ctaText": "string | null",
    "ctaLink": "string | null",
    "order": 0,
    "isActive": true,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

---

### Get Hero by ID (Admin)
```
GET /api/heroes/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Create Hero (Admin)
```
POST /api/heroes
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (min 3 chars)",
  "subtitle": "string (optional)",
  "imageUrl": "string (valid URL)",
  "ctaText": "string (optional)",
  "ctaLink": "string (optional)",
  "order": 0,
  "isActive": true
}
```

---

### Update Hero (Admin)
```
PUT /api/heroes/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Delete Hero (Admin)
```
DELETE /api/heroes/:id
```

**Headers:** `Authorization: Bearer <token>`

---

### Reorder Heroes (Admin)
```
POST /api/heroes/reorder
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderedIds": ["id1", "id2", "id3"]
}
```

---

## 📊 Statistics

**Base Path:** `/api/stats`

### Get Dashboard Statistics (Admin)
```
GET /api/stats/dashboard
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "totalProperties": 0,
  "totalReservations": 0,
  "totalLeads": 0,
  "totalBlogs": 0,
  "recentReservations": [],
  "recentLeads": [],
  "propertiesByStatus": {
    "AVAILABLE": 0,
    "PENDING": 0,
    "SOLD": 0
  },
  "reservationsByStatus": {
    "PRE_RESERVED": 0,
    "CONFIRMED": 0,
    "CANCELLED": 0
  }
}
```

---

## 📦 Data Types & Enums

### Enums

#### PropertyType
```typescript
'RENT' | 'SALE'
```

#### ListingType
```typescript
'LOCATION' | 'VENTE'
```

#### PropertyCategory
```typescript
'VILLA' | 'APPARTEMENT'
```

#### PropertyStatus
```typescript
'AVAILABLE' | 'PENDING' | 'SOLD'
```

#### ReservationStatus
```typescript
'PRE_RESERVED' | 'CONFIRMED' | 'CANCELLED'
```

#### LeadStatus
```typescript
'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED' | 'LOST'
```

#### UserRole
```typescript
'USER' | 'ADMIN'
```

---

### Type Definitions

#### User
```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}
```

#### Property
```typescript
{
  id: string;
  title: string;
  description?: string;
  price: number;
  propertyType: 'RENT' | 'SALE';
  listingType: 'LOCATION' | 'VENTE';
  propertyCategory: 'VILLA' | 'APPARTEMENT';
  status: 'AVAILABLE' | 'PENDING' | 'SOLD';
  cityId: string;
  city?: City;
  address: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  chambres?: number;
  sallesDeBain?: number;
  surface?: number;
  anneeCons?: number;
  garage?: number;
  balcon: boolean;
  climatisation: boolean;
  gazon: boolean;
  machineLaver: boolean;
  tv: boolean;
  parking: boolean;
  piscine: boolean;
  wifi: boolean;
  cuisine: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### City
```typescript
{
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Reservation
```typescript
{
  id: string;
  propertyId: string;
  property?: Property;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  message?: string;
  status: 'PRE_RESERVED' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Lead
```typescript
{
  id: string;
  propertyId: string;
  property?: Property;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Blog
```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  videoUrl?: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### HeroSection
```typescript
{
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔒 Authentication Notes

- The API uses **session-based authentication** with HTTP-only cookies
- Admin login requires **2-step OTP verification**
- Include credentials in requests: `credentials: 'include'`
- Protected routes require the `Authorization: Bearer <token>` header or valid session cookie

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## 🌐 CORS Configuration

The API accepts requests from:
- `http://localhost:3000`
- `http://localhost:3001`

With `credentials: true` enabled for cookie support.

---

## 📌 Quick Reference - Public Endpoints

These endpoints don't require authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API health check |
| `GET` | `/api/properties` | List all properties |
| `GET` | `/api/properties/:id` | Get property details |
| `GET` | `/api/properties/:id/availability` | Check availability |
| `GET` | `/api/cities` | List all cities |
| `GET` | `/api/blogs` | List all blogs |
| `GET` | `/api/blogs/:slug` | Get blog by slug |
| `GET` | `/api/heroes` | List hero sections |
| `POST` | `/api/reservations` | Create reservation |
| `POST` | `/api/leads` | Submit interest |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/forgot-password/request` | Request password reset |
| `POST` | `/api/auth/forgot-password/reset` | Reset password |
