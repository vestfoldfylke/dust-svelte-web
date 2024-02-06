<script>
  import IconClose from "./Icons/IconClear.svelte";
  import IconSearch from "./Icons/IconSearch.svelte";
  import { clickOutside } from "../helpers/click-outside";
  import IconSpinner from "./Icons/IconSpinner.svelte";

  // props
  export let searchValue = ''
  export let placeholder = 'Søk her'
  export let rounded = false
  export let textInputStyle = false
  export let debounceMs = 1000
  export let showClear = true
  export let showPreview = false
  export let showSearch = true
  export let showSelected = false
  export let search = async (query) => {
      return [{fyrste: "hei på deg", andre: "oh oh"}, {fyrste: "tut tut"}, {fyrste: "tut tut"}, {fyrste: "tut tut"}, {fyrste: "tut tut"}, {fyrste: "tut tut"}, {fyrste: "tut tut"}]
  }
  export let callback = (searchRes) => {
      // console.log('callback')
  }
  export let previewMapper = (input) => {
      return input.map((ele) => {
          return {
              first: ele.fyrste ?? null,
              second: ele.andre ?? null,
              third: ele.nested?.tredje ?? null,
              onClick: () => {
                  console.log(`jeg trykket på ${ele.fyrste}`)
              }
          }
      })
  }
  
  // state
  let focusing
  let previewData = []
  let searchError
  let isSearching = false
  let timeout = null

  // functions
  const clear = () => {
      if (timeout) {
          clearTimeout(timeout)
          timeout = null
      }
      isSearching = false
      previewData = []
      searchError = false
  }
  const clearSearch = () => {
      clear()
      searchValue = ''
  }

  const changeActivePreviewItem = (dir) => {
      if (previewData.length < 2) return
      const currIndex = previewData.findIndex(ele => ele.active)
      if (dir === 'up') {
          if (currIndex > 0) {
              previewData[currIndex].active = false
              previewData[currIndex - 1].active = true
              // document.getElementById(`previewItem-${currIndex - 1}`).scrollIntoView()
          }
      } else if (dir === 'down') {
          if (currIndex < previewData.length-1) {
              previewData[currIndex].active = false
              previewData[currIndex + 1].active = true
              //document.getElementById(`previewItem-${currIndex + 1}`).scrollIntoView()
          }
      }
  }

  // LOLs
  const mapPreviewMapper = (mappedPreview) => {
      return mappedPreview.map((item, i) => {
          return {
              ...item,
              active: i === 0,
              id: `previewItem-${i}`,
              onClick: () => {
                  item.onClick()
                  if (!showSelected) clearSearch()
                  else {
                      searchValue = item.first
                      clear()
                  }
              }
          }
      })
  }

  const onFocus = () => {
      if (!focusing) focusing = true
  }
  const onBlur = () => {
      if (focusing) focusing = false
  }
  const onKeydown = (e) => {
      if (focusing && previewData && previewData.length > 0) {
          if (e.key === 'ArrowUp') {
          changeActivePreviewItem('up')
          e.preventDefault()
          } else if (e.key === 'ArrowDown') {
              changeActivePreviewItem('down')
              e.preventDefault()
          } else if (e.key === 'Escape') {
              clear()
              e.preventDefault()
          }  else if (e.key === 'Enter') {
              previewData.find(ele => ele.active).onClick()
              e.preventDefault()
          }
      }
      if (focusing) {
          if (e.key === 'Escape') {
              clear()
              e.preventDefault()
          }
      }
  }

  const searchFunc = async () => {
      try {
          const res = await search(searchValue)
          isSearching = false
          if (res.length === 0) throw new Error('Nada users')
          if (showPreview) {
              previewData = mapPreviewMapper(previewMapper(res)) // Hahahah
          }
          callback(res)
      } catch (error) {
          isSearching = false
          console.log(error.toString())
          if (error.toString() === 'Error: Nada users') searchError = `Ingen resultat funnet ved søk på "${searchValue}"... DET ER BJØRN RIIS SIN SKYLD!! 😬`
          else if (error.response?.status === 404) searchError = 'Bruker ikke funnet... 😬'
          else if (error.response?.status === 401) searchError = 'Du har ikke lov å søke på det 🚫'
          else searchError = "En feil har oppstått - vennligst prøv igjen"
      }
      timeout = null
  }

  const debounceSearch = (ms = debounceMs) => {
      if (showPreview) {
          searchError = null
          isSearching = true
          // If searchValue is big enough
          if (typeof searchValue === 'string' && searchValue.length > 1) {
              // If timeout does not exist already
              if (!timeout) {
                  timeout = setTimeout(searchFunc, ms)
              } else {
                  // If timeout already exist - we restart it
                  clearTimeout(timeout)
                  timeout = setTimeout(searchFunc, ms)
              }
          } else {
              // To small searchstring, we stop the search
              clear()
          }
      }
  }

</script>

<div class="searchContainer" use:clickOutside on:click_outside={onBlur}>
  <div class="searchBar{rounded ? ' rounded' : ''}{textInputStyle ? ' textInput' : ''}{focusing && showPreview && (previewData.length > 0 || isSearching || searchError) ? ' focused' : ''}">
      <input bind:value={searchValue} {placeholder} on:keydown={onKeydown} on:focus={onFocus} on:input={() => debounceSearch()} />
      {#if showClear || showSearch}
          <div class="iconGroup">
              {#if showClear}
                  <div class='icon' on:click={clearSearch}>
                      <IconClose />
                  </div>
              {/if}
              {#if showSearch}
                  <div class='icon' on:click={() => debounceSearch(0)}>
                      <IconSearch />
                  </div>
              {/if}
          </div>
      {/if}
  </div>
  {#if focusing && showPreview && (previewData.length > 0 || isSearching || searchError)}
      <div class="previewContainer">
      {#if isSearching}
          <div class="previewItem searching"><IconSpinner width="1rem" />&nbsp;&nbsp;Søker...</div>
      {:else if searchError}
          <div class="previewItem error">{searchError}</div>
      {:else}
          {#each previewData as pv}
            <div id={pv.id} class="previewItem item{ pv.active ? ' active' : ''}" on:click={pv.onClick}>
                <div class="previewItemProp">
                    {#if pv.firstImage}
                        <img src={pv.firstImage} width="18px" alt="hahah" />
                    {/if}
                    {pv.first || '???'}
                </div>
                <div class="previewItemProp">
                    {pv.second || ''}
                </div>
                <div class="previewItemProp">
                    {pv.third || ''}
                </div>
            </div>
          {/each}
      {/if}
      </div>
  {/if}
</div>


<style>
  .searchContainer {
      width: 100%;
      position: relative;
  }
  .searchBar {
      display: flex;
      align-items: center;
      width: 100%;
      background-color: #fff;
      min-width: 100px;
      height: 3rem;
      padding: 0 1.5rem;
      border: 1px solid rgb(151, 151, 151);
  }

  .searchBar.textInput {
      height: 2rem;
      padding: 0 1rem;
  }
  .searchBar.rounded {
      border-radius: 24px;
  }
  .searchBar.rounded.focused {
      border-radius: 24px 24px 0px 0px;
  }
  .iconGroup {
      display: flex;
      margin-left: auto;
      gap: 8px;
  }
  .icon {
      width: 18px;
      cursor: pointer;
      display: flex;
  }
  .icon:hover {
      transform: scale(1.1);
  }
  input {
      width: 100%;
      height: 100%;
      border: none;
  }
  input:focus {
      outline: 0;
  }
  .previewContainer {
      width: 100%;
      min-width: 100px;
      position: absolute;
      top: calc(100% - 1px);
      background: #fff;
      z-index: 10;
      border: 1px solid rgb(151, 151, 151);
      border-radius: 0 0 24px 24px;
      padding-bottom: 20px;
      /* max-height: 300px; */
      box-shadow: 0 0 0 4px #aedcea;
      box-shadow: 0px 13px 10px 0px rgba(0, 0, 0, 0.3);
      /* overflow-y: auto; */
  }
  .previewItem {
      display: flex;
      align-items: center;
      width: 100%;
      background-color: #fff;
      min-width: 95px;
      min-height: 3rem;
      padding: 0.5rem 1.5rem;
  }
  .previewItemProp {
      width: 33%;
      padding-right: 1rem;
  }
  .previewItem.item:hover {
      background-color: #f0f0f0;
      cursor: pointer;
  }
  .previewItem.active {
      background-color: #D6EDF4;
      scroll-margin-top: 10px;
  }

</style>