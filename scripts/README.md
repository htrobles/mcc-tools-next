# Scripts

This directory contains utility scripts for the MCC Tools application.

## create-user.ts

A script to create new users with proper authentication requirements.

### Usage

```bash
npm run create-user
```

### Features

- **Email Validation**: Ensures the email format is valid
- **Duplicate Check**: Prevents creating users with existing email addresses
- **Password Requirements**: Enforces strong password policies:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Password Confirmation**: Requires password to be entered twice
- **Secure Hashing**: Uses bcryptjs with 12 salt rounds for password hashing
- **User-Friendly**: Interactive prompts with clear error messages

### Example Output

```
=== MCC Tools User Creation Script ===

Enter email address: user@example.com
Enter full name (optional): John Doe
Enter password: MySecurePass123!
Confirm password: MySecurePass123!

✅ User created successfully!
   ID: 507f1f77bcf86cd799439011
   Email: user@example.com
   Name: John Doe

The user can now sign in to the application.
```

### Requirements

- MongoDB database must be running and accessible
- Environment variables must be properly configured in `.env.local`
- Prisma schema must be up to date (`npx prisma db push`)
