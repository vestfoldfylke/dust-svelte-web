export type FailedGetDataSystemData = {
  getDataFailed: boolean;
  message: string;
  error: string;
  customMessage?: string | null;
};

export type Report = {
  _id: string;
  instanceId: string;
  createdTimestamp: string;
  startedTimestamp: string | null;
  running: boolean;
  queued: boolean | null;
  ready: boolean;
  finishedTimestamp: string | null;
  serverRuntime: number | null;
  totalRuntime: number | null;
  runtimeAlert?: RuntimeAlert;
  user: ReportUser;
  caller: {
    upn: string;
    oid: string;
  };
  systems: SystemWithTestsResult[];
};

type ResultStatus = "ok" | "warning" | "error" | "ignore" | "no-data";

export type RuntimeAlert = {
  status: boolean;
  triggeredAtMs: number;
};

export type ReportUser = {
  _id?: string;
  accountEnabled: boolean;
  displayName: string;
  givenName?: string;
  surname?: string;
  userPrincipalName: string;
  jobTitle?: string;
  state?: string;
  department?: string;
  companyName?: string;
  onPremisesSamAccountName?: string;
  onPremisesExtensionAttributes?: {
    extensionAttribute1: string | null;
    extensionAttribute2: string | null;
    extensionAttribute3: string | null;
    extensionAttribute4: string | null;
    extensionAttribute5: string | null;
    extensionAttribute6: string | null;
    extensionAttribute7: string | null;
    extensionAttribute8: string | null;
    extensionAttribute9: string | null;
    extensionAttribute10: string | null;
    extensionAttribute11: string | null;
    extensionAttribute12: string | null;
    extensionAttribute13: string | null;
    extensionAttribute14: string | null;
    extensionAttribute15: string | null;
  };
  userType: "ansatt" | "elev" | "otElev" | "larling" | "slettaElev";
  isTeacher?: boolean;
  feidenavn?: string;
  samAccountName?: string;
  employeeNumber?: string;
  displayNameLowerCase?: string;
  surNameLowerCase?: string;
  updatedAt?: string;
  extraCaution?: boolean;
};

export type SystemWithTestsResult = {
  id: "ad" | "azure" | "fint-ansatt" | "fint-elev" | "fint-larer" | "info" | "nettsperre" | "sync" | "feide";
  name: string;
  description: string | null;
  failed?: boolean;
  startedTimestamp?: string;
  finishedTimestamp?: string | null;
  runtime?: number | null;
  tests: TestCaseResult[];
  data?: FailedGetDataSystemData | Record<string, unknown> | null;
};

export type TestCaseResult = {
  id: string;
  title: string;
  description: string;
  waitForAllData: boolean;
  result?: TestResult | null;
};

export type TestResult = {
  status: ResultStatus;
  message: string;
  solution?: string;
  raw?: unknown;
};
