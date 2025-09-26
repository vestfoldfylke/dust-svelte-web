<script>
  import { page } from '$app/stores'
  import { getReport } from '../../../lib/useApi'
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation'
  import System from '../../../lib/components/System.svelte';
  import IconSpinner from '../../../lib/components/Icons/IconSpinner.svelte';
  import PersonCard from '../../../lib/components/PersonCard.svelte';
  import { onMount } from 'svelte';

  let reportData
  let statusCode
  let interval
  let intervals = []

  const retryAfter = 2000
  
  const alertRuntimeMs = import.meta.env.VITE_ALERT_RUNTIME_MS ?? 30000

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

  // Quick fix - just navigate to the same page to get afterNavigate to run
  onMount(() => {
    goto(`/report/${$page.params.reportId}`, {  replaceState: false })
  })

  // Kjøres når vi har havna på siden - merk at den kjøres IKKE når man refresher siden, derav onMount over
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
    
    interval = setInterval(fetchReportData, retryAfter)
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
  
  function getSystemsWithLongRuntime(report) {
    return report.systems.filter(s => s.runtime > alertRuntimeMs).map(s => ({ name: s.name, loweredName: s.name.toLowerCase(), runtime: s.runtime }))
  }
</script>

{#if !reportData}
  Henter data
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
                    FINT er UFINT <b><u>igjen</u></b> og har brukt {system.runtime / 1000} sekunder <h1 style="display: inline;">🐌</h1>
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