import type { AccountInfo } from "@azure/msal-browser";

export type LoginResponse = {
  account: AccountInfo | Partial<AccountInfo>;
  loginRequestUrl: string;
};
