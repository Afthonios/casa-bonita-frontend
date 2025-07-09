# Next.js Frontend App

This is a public frontend for a headless CMS platform.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Docker-based deployment
- Multi-language routing via [locale]/[slug]
- API connection to Directus (hosted on Hetzner)
- Cloudinary support for media

## Environment Variables

Create a `.env.local` file with the following entries:

```
NEXT_PUBLIC_API_DOMAIN=https://api.your backend.com
NEXT_PUBLIC_FRONTEND_DOMAIN=https://your-frontend-url.com
NEXT_PUBLIC_LANGUAGES=fr,en
```

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Notes

This repo is decoupled from the full `casa-bonita` monorepo and only contains the frontend app.

---
