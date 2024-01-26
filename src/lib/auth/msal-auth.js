import { PublicClientApplication } from '@azure/msal-browser'
import { msalClientStore } from '../stores/store'
import { get } from 'svelte/store'

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID ?? 'klientID',
    authority: import.meta.env.VITE_CLIENT_ISS ?? 'autiruireuir',
    redirectUri: import.meta.env.VITE_REDIRECT_URI ?? 'uriSomewhere'
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  }
}

/**
 * 
 * @param {boolean} [forceLogin=false] 
 * @returns { import('@azure/msal-browser').AccountInfo }
 */
export const login = async (forceLogin = false) => {
  const msalClient = get(msalClientStore) || await PublicClientApplication.createPublicClientApplication(msalConfig)
  const loginResponse = await msalClient.handleRedirectPromise()
  if (loginResponse && !forceLogin) {
    msalClient.setActiveAccount(loginResponse.account)
    msalClientStore.set(msalClient)
    return loginResponse.account
  } else {
    msalClient.loginRedirect({ scopes: ['User.Read'] })
  }
}

export const logout = async () => {
  const msalClient = get(msalClientStore)
  if (!msalClient) return null
  const currentAccounts = msalClient.getAllAccounts()
  if (currentAccounts.length === 0) return null
  const currentAccount = currentAccounts[0]
  await msalClient.logoutRedirect({
      account: currentAccount,
      postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_URI
  })
}