'use server';

import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

// Function to get the raw JWT token
export async function getSessionToken() {
  const headersList = await headers();

  const token = await getToken({
    req: {
      headers: headersList,
    } as any,
    raw: true,
  });

  return token;
}
