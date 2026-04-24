# LifeVault Reminder

LifeVault Reminder is a modern MVP web app for tracking important life dates before they become urgent. It helps manage family documents, renewals, vehicle tasks, bills, birthdays, appointments, subscriptions, and fully custom reminder categories.

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn-style UI components
- Prisma ORM
- Supabase Postgres
- date-fns
- Recharts
- bcryptjs for password hashing

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a Supabase project and copy your Postgres connection strings.

You need:

- `DATABASE_URL`: the pooled connection string for app/runtime queries
- `DIRECT_URL`: the direct connection string for Prisma migrations
- `AUTH_SECRET`: any long random secret

3. Copy environment values if needed:

```bash
cp .env.example .env
```

4. Generate Prisma client:

```bash
pnpm prisma:generate
```

5. Run the database migration against Supabase:

```bash
pnpm prisma:migrate --name init
```

6. Seed demo data:

```bash
pnpm prisma:seed
```

7. Start the app:

```bash
pnpm dev
```

## Demo seed account

- Email: `demo@lifevault.app`
- Password: `demo12345`

## MVP features

- Email/password signup and login
- Protected user-specific reminder data
- Default category creation on signup
- Category create, edit, deactivate, and reactivate flows
- Reminder CRUD with priority, status, repeat, person, vehicle, notes, and amount
- Dashboard with clickable summary cards
- Reminder list with search, filtering, sorting, mobile cards, and desktop table
- Reminder detail page with status actions and renewal history
- Monthly calendar summary
- History/archive view
- Notification settings placeholder page
- Responsive layout with light/dark mode

## Database workflow

- Prisma schema lives in [prisma/schema.prisma](./prisma/schema.prisma)
- Supabase Postgres uses `DATABASE_URL`
- Prisma migrations use `DIRECT_URL`
- Seed script lives in [prisma/seed.ts](./prisma/seed.ts)

## Local commands

- `pnpm dev` - run the development server
- `pnpm build` - build for production
- `pnpm lint` - run linting
- `pnpm prisma:generate` - generate Prisma client
- `pnpm prisma:migrate --name init` - create/update local migration
- `pnpm prisma:seed` - seed optional demo data

## Supabase setup notes

1. Create a new Supabase project.
2. Open `Project Settings -> Database`.
3. Copy the pooled connection string into `DATABASE_URL`.
4. Copy the direct connection string into `DIRECT_URL`.
5. In Netlify, add `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET` as environment variables.
6. Run Prisma migration once before first production use:

```bash
pnpm prisma:migrate --name init
pnpm prisma:seed
```

## Netlify notes

- Netlify should work with this app once the environment variables are set.
- `postinstall` runs `prisma generate`, so Prisma Client will be available during build.
- Do not use SQLite on Netlify for production persistence.

## Future roadmap

- Email reminders
- PWA browser push notifications
- WhatsApp reminders
- Google Calendar sync
- File/photo attachments
- Custom fields per category
- Reminder templates
- Multi-user family sharing
- Export to Excel/PDF
- Advanced analytics
