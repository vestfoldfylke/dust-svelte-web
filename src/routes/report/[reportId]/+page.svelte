<script>
  import { page } from '$app/stores'
  import { getReport } from '../../../lib/useApi'
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import System from '../../../lib/components/System.svelte';
  import IconSpinner from '../../../lib/components/Icons/IconSpinner.svelte';
  import PersonCard from '../../../lib/components/PersonCard.svelte';
  import { onMount } from 'svelte';

  let reportData
  let statusCode
  let interval
  let intervals = []

  // Runtime stuff
  let startTime = new Date()
  let time = new Date()

  onMount(() => {
		const timeInterval = setInterval(() => {
			time = new Date()
		}, 100)

		return () => {
			clearInterval(timeInterval)
		}
	})

  $: runtime = time - startTime


  // Kjøres når vi har havna på siden
  afterNavigate(() => {
    // reset timer
    startTime = new Date()
    const fetchReportData = async () => {
      const { status, data } = await getReport($page.params.reportId)
      reportData = data
      statusCode = status
      if (status === 200) {
        // console.log('Status 200 da stopper vi interval')
        clearInterval(interval)
        for (const inter of intervals) {
          clearInterval(inter)
        }
      } else if (status === 202) {
        // console.log('Status 202, da fortsetter vi interval')
      } else {
        // console.log('status noe annet, what??')
      }
    }
    
    interval = setInterval(fetchReportData, 2000)
    intervals.push(interval)
    fetchReportData()

    return null
  })

  // Kjøres før vi navigerer vekk fra siden
  beforeNavigate(() => {
    clearInterval(interval) // Fjern kjøring av interval når det navigeres vekk fra sluggen / sida
    for (const inter of intervals) {
      clearInterval(inter)
    }
    // console.log('Navigated nå')
  })
</script>

{#if !reportData}
  Henter data
{:else}
  <div>
    <PersonCard user={reportData.user} />
    <!--<pre>{JSON.stringify(reportData.user, null, 2)}</pre>-->
  </div>
  {#if !reportData.systems}
    <div class="systemPlaceholder">
      Vi har ingen tester for denne brukertypen :(
    </div>
    {:else}
      {#if reportData.systems?.length < 1}
        <div class="systemPlaceholder">
          <IconSpinner width="20px" />
          <p>Generer tester for brukeren...</p>
        </div>    
      {/if}
      <div class="runtime">
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
  }
</style>