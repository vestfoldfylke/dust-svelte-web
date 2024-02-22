<script>
  import '../app.css' // Add global css (and make it hot reload)
  import logo from '$lib/assets/logo.png'
  import { login, logout, getMsalClient } from '../lib/auth/msal-auth'
  import DusteSearchBar from '../lib/components/DusteSearchBar.svelte'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import IconSpinner from '../lib/components/Icons/IconSpinner.svelte'

  let account = null
  let currentPage = $page.url.pathname
  console.log('Rett på: ', currentPage)
  console.log('Fra window: ', window.location.href)


  const appTitle = "🥸 D.U.S.T"

  onMount(() => {
    const authenticate = async () => {
      const msalClient = await getMsalClient()
      if (msalClient.getActiveAccount()) {
        account = msalClient.getActiveAccount()
      }
      if (!account) {
        const loginResponse = await login(false, $page.url.pathname) // Sends you to ms auth, and redirects you back here with the msalClient set with active account
        account = loginResponse.account
        if ($page.url.pathname !== loginResponse.loginRequestUrl) {
          goto(loginResponse.loginRequestUrl, { replaceState: false, invalidateAll: true })
        }
      }
    }

    authenticate()

    return () => {
      console.log('Destroyyyy')
      // on destroy (probs just wipe state)
    }
  })

</script>

{#if !account}
  <div class="loading">
    <IconSpinner width={"32px"} />
  </div>
{:else}
  <div class="topbar">
    <div class="toptop">
      <div>
        <img class="logo" src={logo} alt="Fylkekommunens logo" />
      </div>
      <a href="/" title="Gå til forsiden" class="appTitle"><h1>{appTitle}</h1></a>
      <div class="topbarOptions">
        <div>{account.name}</div>
        <div><button class="link" on:click={() => {goto('/help', { replaceState: false, invalidateAll: true })}}><span class="material-symbols-outlined">help</span>Hjelp</button></div>
        <div><button class="link" on:click={async () => {await logout()}}><span class="material-symbols-outlined">logout</span>Logg ut</button></div>
      </div>
    </div>
    <div class="bottomtop">
      <DusteSearchBar />
    </div>
  </div>
  <div class="content">
    <slot></slot>
  </div>
  <div class="footer">
  </div>
{/if}

<style>
  .loading {
    width: 100%;
    margin: auto;
  }
  .appTitle {
    color: black;
    text-decoration: none;
  }
  .topbar {
    width: 100%;
    background-color: var(--himmel-10);
    padding: 20px 0px;
  }
  .toptop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px 40px 40px;
  }
  .topbarOptions {
    float: right;
    display: flex;
    flex-direction: column;
    align-items: self-end;
  }
  .bottomtop {
    width: 100%;
  }
  .logo {
    width: 180px;
  }
  .content {
    padding: 20px 20px 10px 20px;
    margin: auto;
    max-width: 1080px;
  }
  .logoutContainer {
    float: right;
  }
</style>