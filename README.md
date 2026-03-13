# بيتنا | Beitna Home Kitchen Website

A warm, multilingual Next.js website for Beitna-بيتنا — a homemade food business.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with a cozy home-kitchen theme
- **i18n**: next-intl (Arabic [default], Hebrew, English)
- **Database**: Supabase (reservations)
- **Deployment**: Vercel
- **Fonts**: Cairo (Arabic), Heebo (Hebrew), Ubuntu (English)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials and secrets. **Never commit `.env.local` or any file containing real secrets** — they are gitignored.

Required:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — for admin/seed operations (server-side only)
- `ADMIN_PASSWORD` — for portal/admin login
- `SEED_SECRET` — for one-time DB seeding (use a random string)

### 3. Set up Supabase database

Run the SQL in `supabase-schema.sql` in your Supabase SQL editor to create the reservations table.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — defaults to Arabic (RTL).

- Arabic: `http://localhost:3000/` (default)
- Hebrew: `http://localhost:3000/he`
- English: `http://localhost:3000/en`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (Hero, About, Menu Preview, Experiences, Instagram, Contact) |
| `/menu` | Full menu with all categories, sticky nav |
| `/reservations` | Reservation form with Supabase backend |
| `/experiences` | Experiences page (Ramadan, Private Events, Special Evenings) |

## Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then in Vercel dashboard:
# 1. Import GitHub repository
# 2. Add all env vars from .env.example (never commit real values)
# 3. Deploy
```

## Adding Instagram Feed

To enable the live Instagram feed, use one of these services:
- **Behold.so** (recommended) — free plan available, easy setup
- **Elfsight** — Instagram Feed widget
- **SnapWidget** — Instagram widget

Replace the placeholder grid in `src/components/home/InstagramSection.tsx` with your embed code.

## Adding Menu Images

To add dish images:
1. Upload images to `/public/images/` (or use Cloudinary/S3)
2. Add the `image` property to menu items in `src/lib/menu-data.ts`

Example:
```ts
{
  id: 'm-1',
  nameAr: 'انتركوت',
  price: 125,
  image: '/images/entrecote.jpg',  // Add this
}
```

## Contact (to customize)

- Phone: _add Beitna phone here_
- Instagram: _add Beitna Instagram here_
- Location: _add Beitna location here_
- Website: _add Beitna website URL here_
