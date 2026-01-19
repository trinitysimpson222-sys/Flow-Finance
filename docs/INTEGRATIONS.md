# Integrations Setup

## Plaid Integration

**Status:** Currently disabled via feature flag until environment variables are configured on Vercel.

### Enablement Checklist

1. **Get Plaid API Credentials**
   - Sign up at [Plaid Dashboard](https://dashboard.plaid.com/)
   - Get your Client ID and Secret
   - Choose environment: `sandbox`, `development`, or `production`

2. **Configure Vercel Environment Variables**
   
   In your Vercel project settings, add:
   ```
   PLAID_CLIENT_ID=your_client_id_here
   PLAID_SECRET=your_secret_here
   PLAID_ENV=sandbox
   ```

3. **Enable Plaid in Code**
   
   In `src/app/page.tsx`, change:
   ```typescript
   const PLAID_ENABLED = false;
   ```
   to:
   ```typescript
   const PLAID_ENABLED = true;
   ```

4. **Redeploy**
   
   Push changes and redeploy on Vercel:
   ```bash
   git add src/app/page.tsx
   git commit -m "chore: enable plaid integration"
   git push
   ```

## Database (Postgres on Vercel)

The app uses Prisma with PostgreSQL (migrated from SQLite for Vercel compatibility).

### Vercel Postgres Setup

1. In Vercel dashboard, go to Storage tab
2. Create a new Postgres database
3. Vercel will automatically set `DATABASE_URL` environment variable
4. On first deploy, Prisma will run migrations automatically via `postinstall` script

### Local Development with Postgres

For local development:

1. Install Postgres locally or use Docker:
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

2. Update `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/flow_finance?schema=public"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Coinbase OAuth (Optional)

For crypto account integration:

1. Register app at [Coinbase Developer Portal](https://www.coinbase.com/settings/api)
2. Add environment variables to Vercel:
   ```
   COINBASE_CLIENT_ID=your_coinbase_client_id
   COINBASE_CLIENT_SECRET=your_coinbase_client_secret
   COINBASE_REDIRECT_URI=https://your-app.vercel.app/api/crypto/oauth/callback
   ```
