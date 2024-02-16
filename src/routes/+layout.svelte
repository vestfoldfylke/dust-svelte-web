<script>
  import '../app.css' // Add global css (and make it hot reload)
  import logo from '$lib/assets/logo.png'
  import { login, logout } from '../lib/auth/msal-auth'
  import DusteSearchBar from '../lib/components/DusteSearchBar.svelte';

  const appTitle = "🥸 D.U.S.T"

</script>

{#await login()}
  <div class="topbar">
    <div class="toptop">
      <div>
        <img class="logo" src={logo} alt="Fylkekommunens logo" />
      </div>
      <h1>{appTitle}</h1>
      <div>
        <div>Laster...</div>
      </div>
    </div>
    <div class="bottomtop">
      Laster...
    </div>
  </div>
  <div class="content">
    <slot></slot>
  </div>
  <div class="footer">
  </div>
{:then account}
  {#if account && account.username}
    <div class="topbar">
      <div class="toptop">
        <div>
          <img class="logo" src={logo} alt="Fylkekommunens logo" />
        </div>
        <a href="/" title="Gå til forsiden" class="appTitle"><h1>{appTitle}</h1></a>
        <div>
          <div>{account.name}</div>
          <div class="logoutContainer"><button class="link" on:click={async () => {await logout()}}><span class="material-symbols-outlined">logout</span>Logg ut</button></div>
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
{:catch error}
  <h1>App app app: {error}</h1>
{/await}

<style>
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