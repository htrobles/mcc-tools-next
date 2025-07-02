#!/usr/bin/env tsx

import db from '@/lib/db';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import inquirer from 'inquirer';

async function validateEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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

async function createUser() {
  try {
    console.log('=== MCC Tools User Creation Script ===\n');

    // Get user input using Inquirer
    const answers = await (inquirer.prompt as any)([
      {
        type: 'input',
        name: 'email',
        message: 'Enter email address:',
        validate: async (input: string) => {
          if (!(await validateEmail(input))) {
            return 'Please enter a valid email address';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter full name (optional):',
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select user role:',
        choices: [
          { name: 'User', value: Role.USER },
          { name: 'Admin', value: Role.ADMIN },
        ],
        default: Role.USER,
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password:',
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
        message: 'Confirm password:',
        validate: (input: string) => {
          if (input !== answers.password) {
            return 'Passwords do not match';
          }
          return true;
        },
      },
    ]);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: answers.email },
    });

    if (existingUser) {
      console.error('❌ User with this email already exists');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(answers.password, saltRounds);

    // Create user
    const user = await db.user.create({
      data: {
        email: answers.email,
        name: answers.name || null,
        password: hashedPassword,
        role: answers.role,
      },
    });

    console.log('\n✅ User created successfully!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'Not provided'}`);
    console.log(`   Role: ${user.role}`);
    console.log('\nThe user can now sign in to the application.');
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await db.$disconnect();
  }
}

// Run the script
createUser();
