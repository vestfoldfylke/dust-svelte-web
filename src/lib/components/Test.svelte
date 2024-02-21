<script>
    import HighlightJson from "./HighlightJson.svelte"
    import IconSpinner from "./Icons/IconSpinner.svelte"
    import TestStatusCircle from "./TestStatusCircle.svelte"

    export let test
    let dataModal
    let solutionModal

    const norwegianStatus = (status) => {
        if (status === "ok") return "OK"
        if (status === "warning") return "Advarsel"
        if (status === "error") return "Feil"
        return ""
    }

</script>
<div class="test">
    <div class="testHeader">
        {#if !test.result}
            <IconSpinner width="18px" />
            <p class="testTitle">{test.title}</p>
        {:else}
            <TestStatusCircle test={test} />
            {#if test.result.solution}
                <dialog bind:this={solutionModal}>
                    <form method="dialog">
                        <div class="modalTitle">
                            <h2>{test.title}</h2>
                            <button class="link" title="Lukk modal"><span class="material-symbols-outlined">close</span>Lukk</button>
                        </div>
                        <div class="solution">
                            <h3>{test.result.message}</h3>
                            <p><strong>{test.result.status === 'ok' ? 'Informasjon: ' : 'Løsningsforslag: '}</strong>{test.result.solution}</p>
                        </div>
                    </form>
                </dialog>
               <p class="testTitle"><strong>{norwegianStatus(test.result.status)}:</strong><button class="link" title="Se løsningsforslag" on:click={() => {solutionModal.showModal()}}><span class="material-symbols-outlined">info</span>{test.result.message}</button></p>
            {:else}
                <p class="testTitle"><strong>{norwegianStatus(test.result.status)}:</strong>{test.result.message}</p>
            {/if}
            {#if test.result.raw}
                <dialog bind:this={dataModal}>
                    <form method="dialog">
                        <div class="modalTitle">
                            <h2>{test.title} - data</h2>
                            <button class="link" title="Lukk modal"><span class="material-symbols-outlined">close</span>Lukk</button>
                        </div>
                        <div class="rawData">
                            <HighlightJson json={test.result.raw} />
                        </div>
                        <!--<pre>{JSON.stringify(test.result.raw, null, 2)}</pre>-->
                    </form>
                </dialog>
                <button class="link" on:click={() => {dataModal.showModal()}}>Vis data</button>
            {/if}
        {/if}
    </div>
</div>

<style>
    .testTitle {
        display: flex;
        gap: 5px;
        align-items: center;
        padding: 10px;
    }
    .testHeader {
        display: flex;
        gap: 8px;
        align-items: center;
        width: 100%;
    }
    .testTitle {
        flex: 1 1;
        padding-left: 16px;
    }
    .modalTitle {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #c3c3c3;
        margin-bottom: 16px;
    }
    .rawData {
        padding: 0px 8px;
        font-family: "Monospace", "Monaco", "Menlo", "Consolas", "Droid Sans Mono", "Inconsolata", "Courier New",  monospace;
        font-size: 14px;
        letter-spacing: 0.5px;
    }
</style>