import {
  type AccountInfo,
  type AuthenticationResult,
  type Configuration,
  type IPublicClientApplication,
  PublicClientApplication
} from "@azure/msal-browser";
import type { LoginResponse } from "$lib/types/auth";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID ?? "klientID",
    authority: import.meta.env.VITE_CLIENT_ISS ?? "autiruireuir",
    redirectUri: import.meta.env.VITE_REDIRECT_URI ?? "uriSomewhere"
  },
  cache: {
    cacheLocation: "sessionStorage" // This configures where your cache will be stored
  }
};

let msalClient: IPublicClientApplication | null = null;

export const getMsalClient = async (): Promise<IPublicClientApplication> => {
  if (!msalClient) {
    const created: PublicClientApplication = new PublicClientApplication(msalConfig);
    await created.initialize();
    msalClient = created;
  }

  const client: IPublicClientApplication = msalClient;
  if (client.getActiveAccount()) {
    return client;
  }

  const accounts: AccountInfo[] = client.getAllAccounts();

  if (accounts.length === 1 && accounts[0]) {
    client.setActiveAccount(accounts[0]);
    return client;
  }

  if (accounts.length > 1 && accounts[0]) {
    console.log("WOAHWOAHWOAH, flere enn en active bruker i MSAL HER! Åpne en ny fane a...");
    client.setActiveAccount(accounts[0]);
  }

  return client;
};

export const login = async (forceLogin: boolean = false, loginRequestUrl: string = "/"): Promise<LoginResponse | undefined> => {
  if (import.meta.env.VITE_MOCK_MSAL === "true") {
    return {
      account: {
        username: "demospøkelse@domene.no",
        name: "Demo Spøkelse"
      },
      loginRequestUrl
    };
  }

  const client: IPublicClientApplication = await getMsalClient();

  const loginResponse: AuthenticationResult | null = await client.handleRedirectPromise({ navigateToLoginRequestUrl: false });

  if (loginResponse && !forceLogin) {
    client.setActiveAccount(loginResponse.account);
    return {
      account: loginResponse.account,
      loginRequestUrl: loginResponse.state ?? loginRequestUrl
    };
  }

  const activeAccount: AccountInfo | null = client.getActiveAccount();
  if (activeAccount && !forceLogin) {
    return {
      account: activeAccount,
      loginRequestUrl
    };
  }

  client.loginRedirect({ scopes: ["User.Read"], state: loginRequestUrl });

  return undefined;
};

export const logout = async (): Promise<null | undefined> => {
  const client: IPublicClientApplication = await getMsalClient();
  const currentAccounts: AccountInfo[] = client.getAllAccounts();
  const currentAccount: AccountInfo | undefined = currentAccounts[0];
  if (!currentAccount) {
    return null;
  }

  await client.logoutRedirect({
    account: currentAccount,
    postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_URI
  });
};
