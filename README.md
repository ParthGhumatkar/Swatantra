# Local Service Profile & Booking Link System

A Next.js 14 application for local service providers to create their profile pages and receive booking requests.

## Features

- 📱 Mobile + PIN authentication
- 🔗 Shareable profile links (/p/name-service-city)
- 📅 Availability management (morning/afternoon/evening)
- 📨 Booking request management
- 🌐 Multi-language support (EN/HI/MR)
- 📸 Profile photo upload via Cloudinary

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: Neon (PostgreSQL)
- **Auth**: Custom JWT-based
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your Neon database using the schema in `lib/schema.sql`
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.local.example` for required environment variables.

## Database Setup

Run the SQL schema in `lib/schema.sql` against your Neon database to create the required tables.

## Project Structure

See the main documentation for detailed folder structure and architecture.
