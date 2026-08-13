<script lang="ts">
import { onMount } from "svelte";
import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
import { page } from "$app/stores";
import type { ApiResponse } from "$lib/types/api";
import { getReport } from "$lib/useApi.js";
import IconSpinner from "../../../lib/components/Icons/IconSpinner.svelte";
import PersonCard from "../../../lib/components/PersonCard.svelte";
import System from "../../../lib/components/System.svelte";

type ReportSystem = {
  name: string;
  runtime: number;
  tests: {
    title: string;
    result?: {
      status?: string | null;
    };
  }[];
  finishedTimestamp?: string | null;
  data?: {
    getDataFailed?: boolean;
    customMessage?: string;
  } & Record<string, unknown>;
};

type ReportData = {
  user: Record<string, unknown> & { displayName: string };
  systems?: ReportSystem[];
  runtimeAlert?: boolean;
  totalRuntime?: number;
};

type OverLimitSystem = {
  name: string;
  loweredName: string;
  runtime: number;
};

let reportData: ReportData | undefined;
let statusCode: number | undefined;
let interval: ReturnType<typeof setInterval> | undefined;
let intervals: ReturnType<typeof setInterval>[] = [];

const retryAfter: number = 2000;

const alertRuntimeMs: number = Number(import.meta.env.VITE_ALERT_RUNTIME_MS ?? 30000);

// Runtime stuff
let startTime: Date = new Date();
let time: Date = new Date();

onMount((): (() => void) => {
  const timeInterval: ReturnType<typeof setInterval> = setInterval((): void => {
    time = new Date();
  }, 100);

  return (): void => {
    clearInterval(timeInterval);
  };
});

$: runtime = time.getTime() - startTime.getTime();

// Quick fix - just navigate to the same page to get afterNavigate to run
onMount((): void => {
  goto(`/report/${$page.params.reportId}`, { replaceState: false });
});

// Kjøres når vi har havna på siden - merk at den kjøres IKKE når man refresher siden, derav onMount over
afterNavigate((): void => {
  // reset timer
  startTime = new Date();
  const fetchReportData = async (): Promise<void> => {
    const reportId: string | undefined = $page.params.reportId;
    if (!reportId) {
      return;
    }

    const response: ApiResponse = await getReport(reportId);
    reportData = response.data as ReportData;
    statusCode = response.status;

    if (response.status === 200 || response.status === 500) {
      clearInterval(interval);
      for (const inter of intervals) {
        clearInterval(inter);
      }
    }
  };

  interval = setInterval(fetchReportData, retryAfter);
  intervals.push(interval);
  fetchReportData();
});

// Kjøres før vi navigerer vekk fra siden
beforeNavigate((): void => {
  clearInterval(interval); // Fjern kjøring av interval når det navigeres vekk fra sluggen / sida
  for (const inter of intervals) {
    clearInterval(inter);
  }
});

const getSystemsWithLongRuntime = (report: ReportData): OverLimitSystem[] => {
  return (report.systems ?? [])
    .filter((s: ReportSystem): boolean => s.runtime > alertRuntimeMs)
    .map((s: ReportSystem): OverLimitSystem => ({ name: s.name, loweredName: s.name.toLowerCase(), runtime: s.runtime }));
};
</script>

{#if !reportData}
  Henter data
{:else if statusCode === 500}
    <div class="runtimeAlert">
        Noe gikk galt ved henting av rapporten <b>{$page.params.reportId}</b>. Prøv en annen rapport eller kontakt en voksen
    </div>
{:else}
  <div>
    <PersonCard user={reportData.user} />
  </div>
  {#if !reportData.systems}
    <div class="systemPlaceholder">
      Vi har ingen tester for denne brukertypen 😱
    </div>
    {:else}
      {#if reportData.runtimeAlert}
        {@const overLimitSystems = getSystemsWithLongRuntime(reportData)}
        <div class="runtimeAlert">
            Aiaiai 😩 Dette søket tok lang tid, et varsel er sent til systemansvarlige, saken vil bli sett på. Beklager ventetiden.<br />
            {#each overLimitSystems as system, i}
                {#if i > 0}
                    <br />
                {/if}
                {#if system.loweredName.includes('fint') || system.loweredName.includes('inschool')}
                    FINT er UFINT <b><u>igjen</u></b> - ({system.name}) - og har brukt {system.runtime / 1000} sekunder <h1 style="display: inline;">🐌</h1>
                {:else}
                    {system.name} er treg og har brukt {system.runtime / 1000} sekunder <h1 style="display: inline;">🐢</h1>
                {/if}
            {/each}
        </div>
        <div>
          <br> <!--Haha, just to make nth-child be consistent (don't know why though) -->
        </div>
      {/if}
      {#if reportData.systems?.length < 1}
        <div class="systemPlaceholder">
          <IconSpinner width="20px" />
          <p>Generer tester for brukeren...</p>
        </div>    
      {/if}
      <div class="runtime">
        <span class="material-symbols-outlined">timer</span>
        {#if reportData.totalRuntime}
          {(reportData.totalRuntime / 1000).toFixed(1)} s
        {:else}
          {(runtime / 1000).toFixed(1)} s
        {/if}
      </div>
      {#each reportData.systems as system}
        <div class="system">
          <System system={system} />
        </div>
      {/each}
    {/if}
{/if}
<br>


<style>
  .system:nth-child(odd) {
    background-color: var(--vann-10);
  }
  .systemPlaceholder {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .runtime {
    display: flex;
    justify-content: right;
    align-items: center;
    /*font-family: "Courier New", monospace;*/
  }
  .runtime span {
    font-size: 20px;
  }
  .runtimeAlert {
    padding: 8px 15px;
    border: 4px solid var(--nype);
    background-color: var(--nype-10);
  }
</style>