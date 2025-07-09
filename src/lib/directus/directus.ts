// src/lib/directus/directus.ts

import { createDirectus, rest } from '@directus/sdk';

const directusUrl = process.env.NEXT_PUBLIC_API_DOMAIN;

// ✅ ADD THIS LINE TO DEBUG
console.log('--- Attempting to connect to Directus at:', directusUrl, '---');

if (!directusUrl) {
  console.error('FATAL ERROR: NEXT_PUBLIC_API_DOMAIN is not set in your .env.local file!');
}

const directus = createDirectus(directusUrl!).with(rest());

export default directus;