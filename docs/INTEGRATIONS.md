# Integrations

## Plaid (TEMP DISABLED)
Status: Disabled for initial deployment.

To re-enable:
1) Add dependency:
   - npm install react-plaid-link --legacy-peer-deps
2) Restore UI in src/app/page.tsx:
   - re-add usePlaidLink hook and "Connect Bank" button
3) Ensure env vars exist in Vercel:
   - PLAID_CLIENT_ID
   - PLAID_SECRET
   - PLAID_ENV
4) Redeploy
