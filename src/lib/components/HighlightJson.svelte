<script>

  export let json = { hei: "tuttut", hade: false, obj: { hallllla: "oi", balla: true, etarray: [ 'mimimi', { oioio: 23 } ] }, etArrayHEr: ['Maaaama', 'just killed a maaan'], sistemann: "tuitui", jijiji: null }
  export let open = true
  export let level = 1
  export let isLastKey = true
  export let rootPropName = ''

  const tab = '&nbsp;&nbsp;'
  const tabs = tab.repeat(level)
  const rootTabs = tab.repeat(level - 1)

  const tabSpaces = 2
  const keys = json ? Object.keys(json) : null

</script>

{#if open}
  {#if !json}
    Ingen data
  {:else}
    {@html rootTabs}<button class="expandable" on:click={() => {open = !open}}>{Array.isArray(json) ? `${rootPropName}[` : `${rootPropName}{`}</button>
    {#each Object.entries(json) as keyval}
      <span class="line">
        <br>
        {#if typeof keyval[1] !== 'object' || keyval[1] === null || keyval[1] === undefined}
          {#if !Number(keyval[0]) && keyval[0] !== "0"}
            <span class="property">{@html tabs}"{keyval[0]}":</span>
          {:else}
            {@html rootTabs}&nbsp; <!--add one for good measure-->
          {/if}
          <span class={typeof keyval[1] === 'object' ? 'null' : typeof keyval[1]}>
            {typeof keyval[1] === 'string' ? `"${keyval[1]}"` : `${keyval[1]}`}{#if keys.indexOf(keyval[0]) !== keys.length - 1}<span class="endComma">,</span>{/if}
          </span>
        {:else}
          <svelte:self json={keyval[1]} rootPropName={(!Number(keyval[0]) && keyval[0] !== "0") ? `"${keyval[0]}": ` : ''} level={level + 1} open={true} isLastKey={keys.indexOf(keyval[0]) === keys.length - 1} />
        {/if}
      </span>
    {/each}
    <br>
    <span class="closing-tag">{@html rootTabs}{Array.isArray(json) ? ']' : '}'}{!isLastKey ? ',' : ''}</span>
  {/if}
{:else}
  {@html rootTabs}<button class="expandable" on:click={() => {open = !open}}>{Array.isArray(json) ? `${rootPropName}[ ...${keys.length}... ]` : `${rootPropName}{ ...${keys.length}... }`}{!isLastKey ? ',' : ''}</button>
{/if}


<style>
  .string {
    color: #008000;
  }
  .number {
    color: #ee422e;
  }
  .boolean {
    color: #ff8c00;
  }
  .null {
    color: #004ed0;
  }
  button.expandable {
    padding: 0px;
    margin: 0px;
    border: none;
    border-radius: 0px;
    background-color: inherit;
  }
  button.expandable:hover {
    background-color: #E4E5E6;
    font-weight: bold;
  }
  button.expandable:hover ~ .line {
    background-color: #E4E5E6;
  }
  button.expandable:hover ~ .closing-tag {
    background-color: #E4E5E6;
    font-weight: bold;
  }
  .not-selectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .endComma {
    color: black;
  }
</style>

