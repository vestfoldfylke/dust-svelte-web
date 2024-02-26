import axios from 'axios'
import { login, getMsalClient } from './auth/msal-auth'

const getDusteToken = async () => {
  // MOCK access token for local api (the access token is just a demo token - nothing dangerous)
  if (import.meta.env.VITE_MOCK_MSAL === 'true') return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhcGk6Ly9ibGFibGFiIiwiaXNzIjoiaHR0cHM6Ly9kdXN0LmR1c3Rlc2VuLnZ0ZmsubmV0L2hhaGFoLyIsImlhdCI6MTcwNjM2MDM5MiwibmJmIjoxNzA2MzYwMzkyLCJleHAiOjE3MDYzNjU4MjAsImFjciI6IjEiLCJhaW8iOiJiYWJhYmFiYWIiLCJhbXIiOlsicnNhIiwibWZhIl0sInJvbGVzIjpbImR1c3RfYWNjZXNzIiwiYWRtaW5fYWNjZXNzIl0sImFwcGlkIjoiZ3VkZW5lIHZlaXQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlNww7hrZWxzZSIsImdpdmVuX25hbWUiOiJEZW1vIiwiaXBhZGRyIjoiMjAwMToyMDIwOjQzNDE6ZmNiYjoyOTU5OjFjNmE6Y2RhYjoyNGUwIiwibmFtZSI6IkRlbW8gU3DDuGtlbHNlIiwib2lkIjoiMTIzNDUiLCJvbnByZW1fc2lkIjoiU1VTVVNVUyIsInJoIjoic2kgc2Vub3IiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJtYXJpbmUiLCJ0aWQiOiJza2xlbW1lIiwidW5pcXVlX25hbWUiOiJkZW1vLnNwb2tlbHNlQHZlc3Rmb2xkZnlsa2Uubm8iLCJ1cG4iOiJkZW1vLnNwb2tlbHNlQHZlc3Rmb2xkZnlsa2Uubm8iLCJ1dGkiOiJob2hvbyIsInZlciI6IjEuMCJ9.64xzW92dVIXpZ_2OXQ6KQHITtYByDZJn1ycX3p_EkW4'
  let accessToken
  try {
    const msalClient = await getMsalClient()
    if (!msalClient.getActiveAccount()) {
      console.log('Ingen aktiv bruker her enda - venter på ferdig pålogging før vi gjør API spørringer')
      throw new Error('User not logged in yet - waiting for successful login')
    }
    accessToken = (await msalClient.acquireTokenSilent({ scopes: [import.meta.env.VITE_DUST_API_SCOPE] })).accessToken
    return accessToken
  } catch (error) {
    // EN CASE HER ER AT BRUKER har tilgang på frontend men ikke api (app registrering)
    if (error.toString().startsWith('Error: User not logged in yet')) { // Liten frekkas - om bruker ikke er logget inn, kast en error og vent på "vellykket" (hva slags ord skal brukes her egt???) login
      throw error
    }
    // If acquireTokenSilent failed and user is (on the paper/session storage) logged in - we assume the user has been logged out or the refresh token has expired - simply log in again :)
    await login(true) // Sends the user back to main-page, so the search will have to be done again (this should not happen often)
  }
}

const dusteRequest = async (method, endpoint, body) => {
  const accessToken = await getDusteToken()
  const headers = {
    authorization: `Bearer ${accessToken}`
  }
  if (['get', 'delete'].includes(method.toLowerCase())) {
    const res = await axios[method](`${import.meta.env.VITE_DUST_API_URI}/${endpoint}`, { headers })
    return { status: res.status, data: res.data }
  } else {
    const res = await axios[method](`${import.meta.env.VITE_DUST_API_URI}/${endpoint}`, body, { headers })
    return { status: res.status, data: res.data }
  }
}

// Search user base
export const userSearch = async (query) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    const mockData = await import('./helpers/api-mock-data')
    return { status: 200, data: mockData.users }
  }
  return await dusteRequest('get', `UserSearch?query=${query}`)
}

/**
 * 
 * @param {string} reportId ObjectId for the report in mongodb 
 * @returns reportData
 */
export const getReport = async (reportId) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    const mockData = await import('./helpers/api-mock-data')
    const randomInt = Math.floor(Math.random() * 3) // Just to make it loading a bit
    if (randomInt === 1) return { status: 200, data: mockData.generateMockReport(false) }
    return { status: 202, data: mockData.generateMockReport(true) }
  }

  return await dusteRequest('get', `Report/${reportId}`)
}

// Create a new report instance
export const createReport = async (user) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    const mockData = await import('./helpers/api-mock-data')
    return { status: 200, data: mockData.reportId }
  }
  return await dusteRequest('post', 'Report', user._id)
}

// Get chucky
export const getChuck = async () => {
  const res = (await axios.get('https://api.chucknorris.io/jokes/categories')).data
  return res.map(ele => {
    return {
      value: ele,
      category: 'Et valg'
    }
  })
}
