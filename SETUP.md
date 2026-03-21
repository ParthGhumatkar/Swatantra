# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account
- A Cloudinary account (for image uploads)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Neon Database

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy your connection string
3. Run the SQL schema from `lib/schema.sql` in your Neon SQL editor

### 3. Set Up Cloudinary

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your credentials:

```env
# Neon Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname

# Auth (generate a random 32+ character string)
JWT_SECRET=your_random_secret_here_min_32_chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Application

### 1. Create a Provider Account

1. Go to `/signup`
2. Fill in the form:
   - Name: Rohit Kumar
   - Mobile: 9876543210
   - PIN: 1234
   - Service: Electrician
   - City: Pune
   - Language: English

### 2. Access Dashboard

After signup, you'll be redirected to `/dashboard` where you can:
- Copy your profile link
- Edit your profile
- Set availability
- View booking requests
- Change settings

### 3. Test Public Profile

1. Copy your profile link from the dashboard (e.g., `/p/rohit-kumar-electrician-pune`)
2. Open it in an incognito window or different browser
3. Fill out a booking request form
4. Go back to your dashboard and check the Requests page

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── p/[slug]/          # Public provider profiles
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── profile/          # Profile-related components
├── lib/                   # Utilities and helpers
│   ├── db.js             # Database connection
│   ├── auth.js           # Authentication logic
│   ├── slug.js           # Slug generation
│   ├── cloudinary.js     # Image upload
│   └── i18n/             # Translations (EN/HI/MR)
└── middleware.js          # Route protection

```

## Features

✅ **Authentication**
- Mobile + PIN login
- JWT-based sessions
- Protected dashboard routes

✅ **Provider Profile**
- Editable profile (name, service, city, area)
- Photo upload via Cloudinary
- Unique shareable slug (e.g., `/p/name-service-city`)

✅ **Availability Management**
- Set morning/afternoon/evening slots
- Per-day configuration (Mon-Sun)

✅ **Booking Requests**
- Public booking form on profile page
- Dashboard to view/manage requests
- Status tracking (pending/seen/completed)

✅ **Multi-language Support**
- English, Hindi, Marathi
- Provider can set preferred language

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The app is optimized for Vercel with:
- Next.js 14 App Router
- Edge-compatible database (Neon)
- Serverless API routes

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your Neon database is active
- Ensure the SQL schema has been run

### Image Upload Fails

- Verify Cloudinary credentials
- Check file size (keep under 5MB)
- Ensure file is a valid image format

### Authentication Issues

- Clear browser cookies
- Check `JWT_SECRET` is set (min 32 characters)
- Verify middleware is protecting dashboard routes

## Next Steps

After basic setup, consider:

1. **Add payment integration** for premium subscriptions
2. **Implement SMS notifications** for new booking requests
3. **Add analytics** to track profile views
4. **Enable custom domains** for provider profiles
5. **Add review/rating system** for providers

## Support

For issues or questions, check:
- Database schema in `lib/schema.sql`
- API routes in `app/api/`
- Component documentation in respective files
