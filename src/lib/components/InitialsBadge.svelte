<script>
    export let initials = '? ?'
    export let size = 'small'
    export let color = 'himmel-30'
    export let image = undefined
</script>

<main>
    {#if image}
        <img src="{image}" class="initialsBadge {size}" style="background: var(--{color})" alt="bilde av bruker" />
    {:else}
        <div class="initialsBadge {size}" style="background: var(--{color})">{initials}</div>
    {/if}
</main>

<style>
    .initialsBadge {
        border-radius: 50%;
        color: #1D1C28;
        font-size: 16px;
        line-height: 1em;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: -1px;
        user-select: none;
    }
    .initialsBadge.xSmall {
        width: 21px;
        height: 21px;
        font-size: 12px;
        letter-spacing: -1px;
    }
    .initialsBadge.small {
        width: 40px;
        height: 40px;
        font-size: 16px;
        letter-spacing: -1px;
    }
    .initialsBadge.large {
        width: 104px;
        height: 104px;
        font-size: 42px;
        letter-spacing: -3.5px;
    }
    .initialsBadge.medium {
        width: 80px;
        height: 80px;
        font-size: 35px;
        letter-spacing: -2px;
    }
</style>