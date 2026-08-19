import type { IPublicClientApplication } from "@azure/msal-browser";
import type { ApiResponse, HttpMethod } from "$lib/types/api";
import type { Report, ReportUser } from "$lib/types/search";
import { getMsalClient, login } from "./auth/msal-auth.js";

const readBody = async (res: Response): Promise<unknown> => {
  const contentType: string = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
};

const getDusteToken = async (): Promise<string | undefined> => {
  // MOCK access token for local api (the access token is just a demo token - nothing dangerous)
  if (import.meta.env.VITE_MOCK_MSAL === "true") {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhcGk6Ly9ibGFibGFiIiwiaXNzIjoiaHR0cHM6Ly9kdXN0LmR1c3Rlc2VuLnZ0ZmsubmV0L2hhaGFoLyIsImlhdCI6MTcwNjM2MDM5MiwibmJmIjoxNzA2MzYwMzkyLCJleHAiOjE3MDYzNjU4MjAsImFjciI6IjEiLCJhaW8iOiJiYWJhYmFiYWIiLCJhbXIiOlsicnNhIiwibWZhIl0sInJvbGVzIjpbImR1c3RfYWNjZXNzIiwiYWRtaW5fYWNjZXNzIl0sImFwcGlkIjoiZ3VkZW5lIHZlaXQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlNww7hrZWxzZSIsImdpdmVuX25hbWUiOiJEZW1vIiwiaXBhZGRyIjoiMjAwMToyMDIwOjQzNDE6ZmNiYjoyOTU5OjFjNmE6Y2RhYjoyNGUwIiwibmFtZSI6IkRlbW8gU3DDuGtlbHNlIiwib2lkIjoiMTIzNDUiLCJvbnByZW1fc2lkIjoiU1VTVVNVUyIsInJoIjoic2kgc2Vub3IiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJtYXJpbmUiLCJ0aWQiOiJza2xlbW1lIiwidW5pcXVlX25hbWUiOiJkZW1vLnNwb2tlbHNlQHZlc3Rmb2xkZnlsa2Uubm8iLCJ1cG4iOiJkZW1vLnNwb2tlbHNlQHZlc3Rmb2xkZnlsa2Uubm8iLCJ1dGkiOiJob2hvbyIsInZlciI6IjEuMCJ9.64xzW92dVIXpZ_2OXQ6KQHITtYByDZJn1ycX3p_EkW4";
  }

  try {
    const msalClient: IPublicClientApplication = await getMsalClient();
    if (!msalClient.getActiveAccount()) {
      console.log("Ingen aktiv bruker her enda - venter på ferdig pålogging før vi gjør API spørringer");
      throw new Error("User not logged in yet - waiting for successful login");
    }

    return (await msalClient.acquireTokenSilent({ scopes: [import.meta.env.VITE_DUST_API_SCOPE] })).accessToken;
  } catch (error) {
    // EN CASE HER ER AT BRUKER har tilgang på frontend men ikke api (app registrering)
    if (String(error).startsWith("Error: User not logged in yet")) {
      // Liten frekkas - om bruker ikke er logget inn, kast en error og vent på "vellykket" (hva slags ord skal brukes her egt???) login
      throw error;
    }

    // If acquireTokenSilent failed and user is (on the paper/session storage) logged in - we assume the user has been logged out or the refresh token has expired - simply log in again :)
    await login(true); // Sends the user back to main-page, so the search will have to be done again (this should not happen often)
  }
};

const dusteRequest = async <T>(method: HttpMethod, endpoint: string, body?: unknown): Promise<ApiResponse<T>> => {
  const accessToken: string | undefined = await getDusteToken();
  const headers: HeadersInit = {
    authorization: `Bearer ${accessToken}`
  };

  const url: string = `${import.meta.env.VITE_DUST_API_URI}/${endpoint}`;
  const upperMethod: string = method.toUpperCase();
  const init: RequestInit = { method: upperMethod, headers };

  if (upperMethod !== "GET" && upperMethod !== "DELETE" && body !== undefined) {
    headers["content-type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  if (upperMethod === "GET") {
    try {
      const res: Response = await fetch(url, init);
      const data: T = (await readBody(res)) as T;
      return { status: res.status, data };
    } catch (error) {
      const err: Error = error as Error;
      return { status: 500, data: err.stack ?? String(err) };
    }
  }

  const res: Response = await fetch(url, init);
  const data: T = (await readBody(res)) as T;
  return { status: res.status, data };
};

// Search user base
export const userSearch = async (query: string): Promise<ApiResponse<ReportUser[]>> => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === "true") {
    const mockData: typeof import("./helpers/api-mock-data.js") = await import("./helpers/api-mock-data.js");
    return { status: 200, data: mockData.users };
  }

  return await dusteRequest<ReportUser[]>("get", `UserSearch?query=${query}`);
};

export const getReport = async (reportId: string): Promise<ApiResponse<Report>> => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === "true") {
    const mockData: typeof import("./helpers/api-mock-data.js") = await import("./helpers/api-mock-data.js");
    const randomInt: number = Math.floor(Math.random() * 3); // Just to make it loading a bit
    if (randomInt === 1) {
      return { status: 200, data: mockData.generateMockReport(false) };
    }

    return { status: 202, data: mockData.generateMockReport(true) };
  }

  return await dusteRequest<Report>("get", `Report/${reportId}`);
};

// Create a new report instance
export const createReport = async (user: ReportUser): Promise<ApiResponse<string>> => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === "true") {
    const mockData: typeof import("./helpers/api-mock-data.js") = await import("./helpers/api-mock-data.js");
    return { status: 200, data: mockData.generateMockReport(true)._id };
  }

  return await dusteRequest<string>("post", "Report", user._id);
};

/*
// Get Chucky
export const getChuck = async (): Promise<{ value: string; category: string }[]> => {
  const res: string[] = (await (await fetch("https://api.chucknorris.io/jokes/categories")).json()) as string[];
  return res.map((ele: string): { value: string; category: string } => ({ value: ele, category: "Et valg" }));
};
*/
