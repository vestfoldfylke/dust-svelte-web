import { type AccountInfo, type Configuration, type IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID ?? "klientID",
    authority: import.meta.env.VITE_CLIENT_ISS ?? "autiruireuir",
    redirectUri: import.meta.env.VITE_REDIRECT_URI ?? "uriSomewhere",
    navigateToLoginRequestUrl: false // Vi redirecter selv etter succesful login - MSAL klarer det særdeles dårlig...
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  }
};

let msalClient: IPublicClientApplication | null = null;

export const getMsalClient = async (): Promise<IPublicClientApplication> => {
  if (!msalClient) msalClient = await PublicClientApplication.createPublicClientApplication(msalConfig);
  const client = msalClient;
  if (client.getActiveAccount()) return client;
  const accounts = client.getAllAccounts();
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

export type LoginResponse = {
  account: AccountInfo | Partial<AccountInfo>;
  loginRequestUrl: string;
};

export const login = async (forceLogin = false, loginRequestUrl = "/"): Promise<LoginResponse | undefined> => {
  if (import.meta.env.VITE_MOCK_MSAL === "true") {
    return { account: { username: "demospøkelse@domene.no", name: "Demo Spøkelse" }, loginRequestUrl };
  }
  const client = await getMsalClient();

  const loginResponse = await client.handleRedirectPromise();

  if (loginResponse && !forceLogin) {
    client.setActiveAccount(loginResponse.account);
    return { account: loginResponse.account, loginRequestUrl: loginResponse.state ?? loginRequestUrl };
  }
  const activeAccount = client.getActiveAccount();
  if (activeAccount && !forceLogin) {
    return { account: activeAccount, loginRequestUrl };
  }
  client.loginRedirect({ scopes: ["User.Read"], state: loginRequestUrl });
  return undefined;
};

export const logout = async (): Promise<null | undefined> => {
  const client = await getMsalClient();
  const currentAccounts = client.getAllAccounts();
  const currentAccount = currentAccounts[0];
  if (!currentAccount) return null;
  await client.logoutRedirect({
    account: currentAccount,
    postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_URI
  });
};
