<script>
    import IconSpinner from "./Icons/IconSpinner.svelte";
    
    export let test = { result: { status: null } }
</script>

<div>
    {#if !test.result.status}
        <IconSpinner width="20px" />
    {:else if test.result.status === "ok"}
        <div class="testStatus ok"></div>
    {:else if test.result.status === "warning"}
        <div class="testStatus warn"></div>
    {:else if test.result.status === "error"}
        <div class="testStatus error"></div>
    {/if}
</div>

<style>
    .testStatus {
        align-items: center;
        border-radius: 50%;
        display: flex;
        font-size: 10px;
        font-weight: 700;
        height: 16px;
        justify-content: center;
        text-align: center;
        width: 16px;
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
</style>