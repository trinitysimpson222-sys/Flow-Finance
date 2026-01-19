import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Only throw error at runtime, allow build to proceed without env vars
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

if (!isBuildTime && (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET)) {
  throw new Error("Missing Plaid credentials in environment variables");
}

const configuration = new Configuration({
  basePath:
    PlaidEnvironments[
      (process.env.PLAID_ENV as keyof typeof PlaidEnvironments) || "sandbox"
    ],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
      "PLAID-SECRET": process.env.PLAID_SECRET || "",
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
