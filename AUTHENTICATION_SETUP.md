# Authentication Setup Guide

This guide will help you set up secure username/password authentication for the MCC Tools application.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/mcc-tools"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Database Setup

1. Run the Prisma migration to create the authentication tables:

   ```bash
   npx prisma db push
   ```

2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Adding Users

### Using the User Creation Script (Recommended)

The easiest way to add users is using the provided script:

```bash
npm run create-user
```

This script will:

- Prompt for email, name, and password
- Validate email format
- Check for duplicate users
- Enforce strong password requirements
- Hash passwords securely with bcryptjs
- Create the user in the database

### Password Requirements

The system enforces the following password requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Manual User Creation

You can also add users manually using Prisma Studio:

```bash
npx prisma studio
```

Or programmatically:

```typescript
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash('your-password', 12);

// Add a new user
await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: hashedPassword,
  },
});
```

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. You'll be redirected to the sign-in page
4. Enter your email and password to sign in

## Features

- **Secure Authentication**: Password hashing with bcryptjs
- **Strong Password Policy**: Enforced password requirements
- **Protected Routes**: All routes except auth pages require authentication
- **Session Management**: Automatic session handling with NextAuth.js
- **Sign Out**: Users can sign out from the sidebar
- **User Management**: Easy user creation with validation

## Security Notes

- Keep your `NEXTAUTH_SECRET` secure and unique
- Use environment variables for all sensitive configuration
- Passwords are hashed with bcryptjs using 12 salt rounds
- Email addresses must be unique
- Consider adding rate limiting for login attempts
- The system validates password complexity requirements
