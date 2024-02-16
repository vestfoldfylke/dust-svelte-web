<script>
    import IconSpinner from "./Icons/IconSpinner.svelte";
    import SystemStatusCircle from "./SystemStatusCircle.svelte";
    import Test from "./Test.svelte";

    export let system
    let systemStatus = "loading"
    let warnings = 0
    let errors = 0

    let collapsed = true
    let dataModal

    const getSystemStatus = (tests) => {
        const running = tests.filter(test => !test.result).length
        const warnings = tests.filter(test => test.result?.status === "warning").length
        const errors = tests.filter(test => test.result?.status === "error").length
        if (running > 0) {
            systemStatus = "loading"
        }
        else if (errors > 0) {
            systemStatus = "error"
        }
        else if (warnings > 0) {
            systemStatus = "warn"
        } else (
            systemStatus = "ok"
        )
        return  { systemStatus, warnings, errors }
    }
    $: {
        let status = getSystemStatus(system.tests || [])
        systemStatus = status.systemStatus
        warnings = status.warnings
        errors = status.errors
    }
    /*
    $: {
        collapsed = system.finishedTimestamp && systemStatus === "ok"
    }
    */
</script>

<div class="system{!collapsed ? ' open' : ''}">
    <div class="systemHeader{!collapsed ? ' open' : ''}" on:click={() => { collapsed = !collapsed }}>
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
            {#each system.tests as test}
                <Test test={test} />
            {/each}
            <div class="systemFooter">
                <dialog bind:this={dataModal}>
                    <form method="dialog">
                        <button>Lukk</button>
                        <pre>{JSON.stringify(system.data, null, 2)}</pre>
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
        margin: 10px 0px;
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
        padding: 15px 0px;
        display: flex;
        justify-content: right;
    }
</style>