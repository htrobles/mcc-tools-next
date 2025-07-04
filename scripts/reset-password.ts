#!/usr/bin/env tsx

import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import inquirer from 'inquirer';

async function validatePassword(
  password: string
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function resetPassword() {
  try {
    console.log('=== MCC Tools Password Reset Script ===\n');

    // Fetch all users
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database.');
      return;
    }

    // Create choices for user selection
    const userChoices = users.map((user) => ({
      name: `${user.email}${user.name ? ` (${user.name})` : ''} - ${user.role}`,
      value: user.id,
    }));

    // Get user input using Inquirer
    const answers = await (inquirer.prompt as any)([
      {
        type: 'list',
        name: 'userId',
        message: 'Select a user to reset password:',
        choices: userChoices,
      },
      {
        type: 'password',
        name: 'newPassword',
        message: 'Enter new password:',
        validate: async (input: string) => {
          const validation = await validatePassword(input);
          if (!validation.isValid) {
            return `Password validation failed:\n${validation.errors.join('\n')}`;
          }
          return true;
        },
      },
    ]);

    // Get password confirmation separately
    await (inquirer.prompt as any)([
      {
        type: 'password',
        name: 'passwordConfirmation',
        message: 'Confirm new password:',
        validate: (input: string) => {
          if (input !== answers.newPassword) {
            return 'Passwords do not match';
          }
          return true;
        },
      },
    ]);

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(answers.newPassword, saltRounds);

    // Update the user's password
    const updatedUser = await db.user.update({
      where: { id: answers.userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log('\n✅ Password reset successfully!');
    console.log(`   User ID: ${updatedUser.id}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Name: ${updatedUser.name || 'Not provided'}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log('\nThe user can now sign in with their new password.');
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await db.$disconnect();
  }
}

// Run the script
resetPassword();
