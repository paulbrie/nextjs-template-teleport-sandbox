# My App

A Next.js application with PostgreSQL database and Drizzle ORM.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database running locally

### Environment Variables

The `.env` file contains the necessary configuration:

```env
DATABASE_URL=postgresql://postgres@localhost:5432/postgres
```

### Database Setup and Seeding

The database is automatically seeded when you run the development server. The `predev` script runs before `dev` to ensure the database schema is pushed and seeded.

#### Available Database Scripts

```bash
# Push database schema and seed (runs automatically before dev)
npm run db:setup

# Push database schema only
npm run db:push

# Seed the database with initial data
npm run db:seed

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate
```

#### Manual Seeding Procedure

If you need to manually seed the database:

1. Ensure PostgreSQL is running and accessible
2. Run the database setup:
   ```bash
   npm run db:setup
   ```

This will:
- Push the database schema (create tables if they don't exist)
- Seed the database with initial data (admin user)

#### Seed Data

The following default user is created:

- **Email:** paul.brie@teleporthq.io
- **Password:** admin
- **Role:** admin

### Running the Development Server

```bash
npm run dev
```

This will automatically:
1. Push the database schema
2. Seed the database with initial data
3. Start the Next.js development server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running Tests

```bash
npm run test
```

## Database Schema

The application uses the following tables:

- **users** - User accounts with authentication
- **sessions** - Session management for NextAuth
- **accounts** - OAuth account linking
- **verification_tokens** - Email verification tokens
- **todos** - Todo items with user associations

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
