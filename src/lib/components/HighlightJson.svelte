<script>

  export let json = { hei: "tuttut", hade: false, obj: { hallllla: "oi", balla: true, etarray: [ 'mimimi', { oioio: 23 } ] }, etArrayHEr: ['Maaaama', 'just killed a maaan'], sistemann: "tuitui" }
  export let open = true
  export let level = 1
  export let isLastKey = true
  export let rootPropName = ''

  const tab = '&nbsp;&nbsp;'
  const tabs = tab.repeat(level)
  const rootTabs = tab.repeat(level - 1)

  const tabSpaces = 2
  const keys = Object.keys(json)

</script>

{#if open}
  {@html rootTabs}<button class="expandable" on:click={() => {open = !open}}>{Array.isArray(json) ? `${rootPropName}[` : `${rootPropName}{`}</button>
  {#each Object.entries(json) as keyval}
    <span class="line">
      <br>
      {#if typeof keyval[1] !== 'object'}
        {#if !Number(keyval[0]) && keyval[0] !== "0"}
          <span class="property">{@html tabs}"{keyval[0]}":</span>
        {:else}
          {@html rootTabs}&nbsp; <!--add one for good measure-->
        {/if}
        <span class={typeof keyval[1]}>
          {typeof keyval[1] === 'string' ? `"${keyval[1]}"` : keyval[1]}{keys.indexOf(keyval[0]) === keys.length - 1 ? '' : ','}
        </span>
      {:else}
        <svelte:self json={keyval[1]} rootPropName={(!Number(keyval[0]) && keyval[0] !== "0") ? `"${keyval[0]}": ` : ''} level={level + 1} open={true} isLastKey={keys.indexOf(keyval[0]) === keys.length - 1} />
      {/if}
    </span>
  {/each}
  <br>
  <span class="closing-tag">{@html rootTabs}{Array.isArray(json) ? ']' : '}'}{!isLastKey ? ',' : ''}</span>
  {:else}
  {@html rootTabs}<button class="expandable" on:click={() => {open = !open}}>{Array.isArray(json) ? `${rootPropName}[ ...${keys.length}... ]` : `${rootPropName}{ ...${keys.length}... }`}{!isLastKey ? ',' : ''}</button>
{/if}

<!--Original
{#if open}
  <button class="expandable" on:click={() => {open = !open}}>{Array.isArray(json) ? '[' : '{'}</button>
  {#each Object.entries(json) as keyval}
    <span class="line">
      <br>
      {#if !Number(keyval[0]) && keyval[0] !== "0"}
        <span class="property">{@html tabs}"{keyval[0]}":</span>
      {:else}
        {@html rootTabs}&nbsp; <!--add one for good measure
      {/if}
      {#if typeof keyval[1] !== 'object'}
        <span class={typeof keyval[1]}>
          {typeof keyval[1] === 'string' ? `"${keyval[1]}"` : keyval[1]}{keys.indexOf(keyval[0]) === keys.length - 1 ? '' : ','}
        </span>
      {:else}
        <svelte:self json={keyval[1]} level={level + 1} open={true} isLastKey={keys.indexOf(keyval[0]) === keys.length - 1} />
      {/if}
    </span>
  {/each}
  <br>
  {@html rootTabs}{Array.isArray(json) ? ']' : '}'}{!isLastKey ? ',' : ''}
  {:else}
  <button class="expandable" on:click={() => {open = !open}}>{Array.isArray(json) ? '[ ... ]' : '{ ... }'}{!isLastKey ? ',' : ''}</button>
{/if}
  -->

<style>
  .tt {
    display: inline-block;
  }
  .code {
    display: inline-block;
  }
  div {
    font-family: "Monaco", "Menlo", "Consolas", "Droid Sans Mono", "Inconsolata", "Courier New",  monospace;
  }
  .string {
    color: red;
  }
  .number {
    color: blue;
  }
  .boolean {
    color: aquamarine;
  }
  button.expandable {
    padding: 0px;
    margin: 0px;
    border: none;
    border-radius: 0px;
    background-color: inherit;
  }
  button.expandable:hover {
    background-color: aquamarine;
  }
  button.expandable:hover ~ .line {
    background-color: aquamarine;
  }
  button.expandable:hover ~ .closing-tag {
    background-color: aquamarine;
  }
  .not-selectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

