<script lang="ts">
import type { SystemWithTestsResult, TestCaseResult } from "$lib/types/search";
import HighlightJson from "./HighlightJson.svelte";
import IconSpinner from "./Icons/IconSpinner.svelte";
import SystemStatusCircle from "./SystemStatusCircle.svelte";
import Test from "./Test.svelte";

type SystemStatusResult = {
  systemStatus: string;
  warnings: number;
  errors: number;
};

export let system: SystemWithTestsResult;

let systemStatus: string = "loading";
let warnings: number = 0;
let errors: number = 0;
let collapsed: boolean = true;
let dataModal: HTMLDialogElement;

const getSystemStatus = (tests: TestCaseResult[], data: SystemWithTestsResult["data"]): SystemStatusResult => {
  if (data && "getDataFailed" in data && data.getDataFailed) {
    return { systemStatus: "dead", warnings: 0, errors: 0 };
  }

  const running: number = tests.filter((test: TestCaseResult): boolean => !test.result).length;
  const warningCount: number = tests.filter((test: TestCaseResult): boolean => test.result?.status === "warning").length;
  const errorCount: number = tests.filter((test: TestCaseResult): boolean => test.result?.status === "error").length;

  let status: string;
  if (running > 0) {
    status = "loading";
  } else if (errorCount > 0) {
    status = "error";
  } else if (warningCount > 0) {
    status = "warn";
  } else {
    status = "ok";
  }

  return { systemStatus: status, warnings: warningCount, errors: errorCount };
};

$: {
  const status: SystemStatusResult = getSystemStatus(system.tests || [], system.data);
  systemStatus = status.systemStatus;
  warnings = status.warnings;
  errors = status.errors;
}
</script>

<div class="system{!collapsed ? ' open' : ''}">
    <div class="systemHeader{!collapsed ? ' open' : ''}" role="button" tabindex="0" aria-expanded={!collapsed} on:click={() => { collapsed = !collapsed }} on:keydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); collapsed = !collapsed; } }}>
        {#if !system.finishedTimestamp}
            <IconSpinner width="32px" />
        {:else}
            <SystemStatusCircle {systemStatus} {warnings} {errors} />
        {/if}
        <h3 class="systemTitle">{system.name}</h3>
        {#if collapsed}
            <span class="material-symbols-outlined">expand_more</span>
        {:else}
            <span class="material-symbols-outlined">expand_less</span>
        {/if}
    </div>
    {#if !collapsed}
        <div class="systemContent">
            {#if systemStatus === "dead"}
                <div>
                    {#if system.data?.customMessage}
                        ⚠️ {system.data.customMessage}
                    {:else}
                        ☠️ Det skjedde en feil ved henting av data fra {system.name}. Prøv igjen senere eller kontakt en voksen.
                    {/if}
                </div>
            {/if}
            {#each system.tests as test}
                {#if test.result?.status !== 'ignore'}
                    <Test test={test} />
                {/if}
            {/each}
            <div class="systemFooter">
                <dialog bind:this={dataModal}>
                    <form method="dialog">
                        <div class="modalTitle">
                            <h2>{system.name} - data</h2>
                            <button class="link" title="Lukk modal"><span class="material-symbols-outlined">close</span>Lukk</button>
                        </div>
                        <div class="rawData">
                            <HighlightJson json={(system.data ?? null) as Record<string, unknown> | null} />
                        </div>
                    </form>
                </dialog>
                <button class="link" on:click={() => {dataModal.showModal()}}>
                    <span class="material-symbols-outlined">data_object </span>Se raw-data
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .system.open {
        margin: 10px 0;
    }
    .systemHeader:hover {
        cursor: pointer;
        background-color: var(--vann-30);
    }
    .systemHeader {
        display: flex;
        /*justify-content: space-between;*/
        padding: 15px;
        display: flex;
        gap: 8px;
        align-items: center;
        width: 100%;
    }
    .systemHeader.open {
        background-color: var(--vann-10);
        border-right: 1px solid #c3c3c3;
        border-left: 1px solid #c3c3c3;
        border-top: 1px solid #c3c3c3;
        border-bottom: 1px solid #c3c3c3;
    }
    .systemHeader.open:hover {
        cursor: pointer;
        background-color: var(--vann-20);
    }
    .systemTitle {
        flex: 1 1;
        padding-left: 16px;
    }
    .systemContent {
        padding: 15px 15px 15px 30px;
        background-color: white;
        border-right: 1px solid #c3c3c3;
        border-left: 1px solid #c3c3c3;
        border-bottom: 1px solid #c3c3c3;
    }
    .systemFooter {
        padding: 15px 0;
        display: flex;
        justify-content: right;
    }
    .modalTitle {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #c3c3c3;
        margin-bottom: 16px;
    }
    .rawData {
        padding: 0 8px;
        font-family: "Monospace", "Monaco", "Menlo", "Consolas", "Droid Sans Mono", "Inconsolata", "Courier New",  monospace;
        font-size: 14px;
        letter-spacing: 0.03rem;
    }
</style>