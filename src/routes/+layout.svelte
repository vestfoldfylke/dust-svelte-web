<script>
  import '../app.css' // Add global css (and make it hot reload)
  import SearchBar from '../lib/components/SearchBar.svelte';
  import logo from '$lib/assets/logo.png'
  import { login, logout } from '../lib/auth/msal-auth'
</script>

{#await login()}
  Først må vi jo logge deg på
{:then account}
  {#if account && account.username}
    <div class="topbar">
      <div class="toptop">
        <div>
          <img class="logo" src={logo} alt="Fylkekommunens logo" />
        </div>
        <h1>litt D.U.S.T</h1>
        <div>
          <div>{account.name}</div>
          <div><button on:click={async () => {await logout()}}>Logout</button></div>
        </div>
      </div>
      <div class="bottomtop">
        <div class="searchContainer">
          <SearchBar rounded={true} debounceMs={1000} showPreview={true} placeholder="Søk her" />
        </div>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">
    </div>
  {/if}
{:catch error}
  <h1>App app app: {error}</h1>
{/await}

<style>
  .topbar {
    width: 100%;
    background-color: rgba(190, 218, 202, 0.3);
    padding: 20px 0px;
  }
  .toptop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 40px 40px 40px;
  }
  .bottomtop {
    width: 100%;
  }
  .logo {
    width: 150px;
  }
  .searchContainer {
    margin: auto;
    max-width: 800px;
  }
  .content {
    padding-top: 20px;
    margin: auto;
    max-width: 1080px;
  }
</style>