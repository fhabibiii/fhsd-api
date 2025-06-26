# FHSD Backend

Backend for FHSD company website using Express with TypeScript and MySQL with Prisma ORM.

## Features

- Authentication system with JWT (access token, refresh token)
- Projects management
- Services management with features
- Messages handling
- Contact info management
- File/image upload with optimization
- Security features (rate limiting, input validation, XSS protection)

## Prerequisites

- Node.js (v14+)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fhsd
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content (adjust as needed):
```
DATABASE_URL="mysql://username:password@localhost:3306/fhsd_db"
PORT=3000
JWT_ACCESS_SECRET="your_access_secret_key_here"
JWT_REFRESH_SECRET="your_refresh_secret_key_here"
ACCESS_TOKEN_EXPIRY="15s"
REFRESH_TOKEN_EXPIRY="7d"
UPLOADS_FOLDER="uploads"
```

4. Create and migrate the database:
```bash
npm run prisma:migrate
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token (requires valid refresh token)
- `POST /api/auth/logout` - Logout user (requires authentication)

### Projects

- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get project by ID (public)
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Services

- `GET /api/services` - Get all services with features (public)
- `GET /api/services/:id` - Get service by ID with features (public)
- `POST /api/services` - Create new service with features (admin only)
- `PUT /api/services/:id` - Update service and its features (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Messages

- `POST /api/messages` - Send a message (public)
- `GET /api/messages` - Get all messages (admin only)
- `GET /api/messages/:id` - Get message by ID (admin only)
- `PATCH /api/messages/:id/read` - Mark message as read (admin only)
- `DELETE /api/messages/:id` - Delete message (admin only)

### Contact Info

- `GET /api/contact-info` - Get contact information (public)
- `POST /api/contact-info` - Create contact information (admin only)
- `PUT /api/contact-info` - Update contact information (admin only)

### File Upload

- `POST /api/upload/image` - Upload and optimize an image (admin only)

## Security Features

- JWT Token Authentication
  - Access Token: 15 seconds expiry
  - Refresh Token: 7 days expiry
  - Automatic token refresh
  - Token blacklisting on logout

- Password Security
  - Bcrypt hashing

- File Upload Security
  - File type validation (images only)
  - File size limits (10MB max)
  - Secure filename generation
  - Image optimization

- Rate Limiting
  - Authentication endpoints: 5 requests/minute
  - Message submissions: 3 submissions/5 minutes
  - File uploads: 10 uploads/minute

- Input Validation
  - Email format validation
  - Required field validation
  - XSS protection
  - SQL injection prevention
