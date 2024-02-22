<script>
    import IconSpinner from "./Icons/IconSpinner.svelte";

    export let systemStatus = "loading"
    export let warnings = 0
    export let errors = 0

</script>

<div class="systemStatus">
    {#if systemStatus === "loading"}
        <IconSpinner width="32px" />
    {:else if systemStatus === "ok"}
        <div class="systemStatus ok">OK</div>
    {:else if systemStatus === "warn"}
        <div class="systemStatus warn">{warnings}</div>
    {:else if systemStatus === "error"}
        <div class="systemStatus error">{errors}</div>
    {:else if systemStatus === "failed"}
        <div class="systemStatus failed">!</div>
    {/if}
</div>

<style>
    .systemStatus {
        align-items: center;
        border-radius: 50%;
        display: flex;
        font-size: 10px;
        font-weight: 700;
        height: 32px;
        justify-content: center;
        text-align: center;
        width: 32px;
        background: #fff;
    }
    .ok {
        border: 4px solid #52d120;
    }
    .warn {
        border: 4px solid #FFBA33;
    }
    .error {
        border: 4px solid #ec4d5d;
    }
    .failed {
        border: 4px solid #ec4d5d;
        font-size: 20px;
    }
</style>