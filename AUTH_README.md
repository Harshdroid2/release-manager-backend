# Authentication System Documentation

This project implements a comprehensive authentication system similar to `fa_nestjs_dms_login` with the following features:

## Features

- **JWT-based Authentication**: Secure token-based authentication
- **User Registration & Login**: Email/password authentication
- **GitHub OAuth Integration**: Social login with GitHub
- **Role-based Access Control**: Support for different user roles (ADMIN, DEV, QA, RELEASE_MANAGER)
- **Password Hashing**: Secure password storage using bcrypt
- **User Profiles**: Extended user information with profiles
- **Guards & Decorators**: Easy-to-use authentication guards and decorators

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "<password>",
  "firstName": "John",
  "lastName": "Doe",
  "role": "dev"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "<password>"
}
```

#### GitHub OAuth Login
```http
POST /api/auth/github
Content-Type: application/json

{
  "code": "github_oauth_code"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer <jwt_token>
```

### GitHub OAuth Flow

1. **Initiate GitHub Login**:
   ```http
   GET /api/auth/github/login
   ```
   This redirects to GitHub OAuth page.

2. **GitHub Callback**:
   ```http
   GET /api/auth/github/callback?code=<github_code>
   ```
   This redirects to frontend with the code.

3. **Process GitHub Code**:
   ```http
   POST /api/auth/github
   Content-Type: application/json

   {
     "code": "<github_code>"
   }
   ```

## User Roles

- **ADMIN**: Full access to all features
- **DEV**: Developer access to projects and releases
- **QA**: Quality assurance access
- **RELEASE_MANAGER**: Release management access

## Database Schema

### Users Table
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Hashed password
- `github_username`: GitHub username (optional)
- `github_access_token`: GitHub access token (optional)
- `role`: User role enum
- `is_active`: Account status
- `is_verified`: Email verification status
- `last_login`: Last login timestamp
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### Profiles Table
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `email`: User email
- `first_name`: User's first name
- `last_name`: User's last name
- `avatar_url`: Profile picture URL
- `is_approved`: Profile approval status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=change_me
DB_NAME=release_manager

# JWT Configuration
JWT_SECRET=change_me
JWT_EXPIRES_IN=24h

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=change_me
GITHUB_CLIENT_SECRET=change_me

# Application Configuration
NODE_ENV=development
PORT=4000
```

## Usage Examples

### Protecting Routes

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Public } from './auth/decorators/public.decorator';

@Controller('example')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class ExampleController {
  
  @Public() // This route is public (no authentication required)
  @Get('public')
  getPublicData() {
    return { message: 'This is public data' };
  }

  @Get('protected')
  getProtectedData(@CurrentUser() user: User) {
    return { message: 'This is protected data', user: user.email };
  }

  @Roles(UserRole.ADMIN) // Only admins can access this route
  @UseGuards(RolesGuard)
  @Get('admin-only')
  getAdminData() {
    return { message: 'This is admin-only data' };
  }
}
```

### Frontend Integration

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: '<password>'
  })
});

const { access_token, user } = await loginResponse.json();

// Use token in subsequent requests
const protectedResponse = await fetch('/api/v1/projects', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
- **JWT Tokens**: Secure JWT tokens with configurable expiration
- **Input Validation**: All inputs are validated using class-validator
- **Role-based Access**: Fine-grained access control based on user roles
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS Support**: Cross-origin resource sharing configured
- **Rate Limiting**: Can be easily added for additional security

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up database:
   ```bash
   # Make sure PostgreSQL is running
   # The application will create tables automatically in development mode
   ```

4. Start the application:
   ```bash
   npm run start:dev
   ```

The authentication system is now ready to use!

