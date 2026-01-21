export interface SimpleFINAccount {
  id: string;
  org: { domain: string; name: string };
  name: string;
  currency: string;
  balance: string;
  "available-balance"?: string;
  "balance-date": number;
  transactions: SimpleFINTransaction[];
}

export interface SimpleFINTransaction {
  id: string;
  posted: number;
  amount: string;
  description: string;
  payee?: string;
  pending?: boolean;
}

export interface SimpleFINResponse {
  errors: string[];
  accounts: SimpleFINAccount[];
}

export function decodeSetupToken(setupToken: string): string {
  return Buffer.from(setupToken, "base64").toString("utf-8");
}

export async function claimSetupToken(setupToken: string): Promise<string> {
  const claimUrl = decodeSetupToken(setupToken);
  console.log("Claiming URL:", claimUrl);
  const response = await fetch(claimUrl, { method: "POST", headers: { "Content-Length": "0" } });
  if (!response.ok) throw new Error(`Failed to claim: ${response.status} ${response.statusText}`);
  const accessUrl = await response.text();
  console.log("Got access URL:", accessUrl.replace(/:[^:@]+@/, ":****@")); // Log with hidden password
  return accessUrl;
}

export function parseAccessUrl(accessUrl: string) {
  const url = new URL(accessUrl);
  const username = url.username;
  const password = url.password;
  url.username = "";
  url.password = "";
  // Ensure trailing slash for path
  let baseUrl = url.toString();
  if (!baseUrl.endsWith("/")) baseUrl += "/";
  return { baseUrl, username, password };
}

export async function fetchSimpleFINAccounts(accessUrl: string, options?: { startDate?: number; endDate?: number }): Promise<SimpleFINResponse> {
  const { baseUrl, username, password } = parseAccessUrl(accessUrl);
  
  let url = `${baseUrl}accounts`;
  const params = new URLSearchParams();
  if (options?.startDate) params.append("start-date", options.startDate.toString());
  if (options?.endDate) params.append("end-date", options.endDate.toString());
  if (params.toString()) url += `?${params}`;
  
  console.log("Fetching SimpleFIN accounts from:", url);
  
  const response = await fetch(url, {
    method: "GET",
    headers: { 
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error("SimpleFIN error response:", text);
    throw new Error(`SimpleFIN error: ${response.status} - ${text}`);
  }
  return response.json();
}

export function mapSimpleFINAccountType(account: SimpleFINAccount) {
  const name = account.name.toLowerCase();
  if (name.includes("checking")) return { type: "depository", subtype: "checking" };
  if (name.includes("saving")) return { type: "depository", subtype: "savings" };
  if (name.includes("credit")) return { type: "credit", subtype: "credit card" };
  if (name.includes("investment") || name.includes("401k") || name.includes("ira")) return { type: "investment", subtype: "brokerage" };
  return { type: "depository", subtype: null };
}

export function getAccountMask(id: string): string { return id.slice(-4); }
