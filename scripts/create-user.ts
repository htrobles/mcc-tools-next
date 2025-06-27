#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

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

    // Get user input
    const email = await question('Enter email address: ');

    // Validate email
    if (!(await validateEmail(email))) {
      console.error('❌ Invalid email format');
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('❌ User with this email already exists');
      return;
    }

    const name = await question('Enter full name (optional): ');

    let password: string;
    let passwordConfirmation: string;

    do {
      password = await question('Enter password: ');

      const passwordValidation = await validatePassword(password);

      if (!passwordValidation.isValid) {
        console.error('❌ Password validation failed:');
        passwordValidation.errors.forEach((error) =>
          console.error(`   - ${error}`)
        );
        continue;
      }

      passwordConfirmation = await question('Confirm password: ');

      if (password !== passwordConfirmation) {
        console.error('❌ Passwords do not match');
        continue;
      }

      break;
    } while (true);

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
      },
    });

    console.log('\n✅ User created successfully!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'Not provided'}`);
    console.log('\nThe user can now sign in to the application.');
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Run the script
createUser();
