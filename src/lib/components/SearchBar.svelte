<script lang="ts">
import { clickOutside } from "../helpers/click-outside.js";
import IconClose from "./Icons/IconClear.svelte";
import IconSearch from "./Icons/IconSearch.svelte";
import IconSpinner from "./Icons/IconSpinner.svelte";

type SearchInput = Record<string, unknown> & {
  fyrste?: string;
  andre?: string;
  nested?: {
    tredje?: string
  }
};

type PreviewItem = {
  first?: string | null;
  firstImage?: string | null;
  second?: string | null;
  third?: string | null;
  onClick: () => void;
  active?: boolean;
  id?: string;
};

// props
export let searchValue: string = "";

export let placeholder: string = "Søk her";

export let rounded: boolean = false;

export let textInputStyle: boolean = false;

export let debounceMs: number = 1000;

export let showClear: boolean = true;

export let showPreview: boolean = false;

export let showSearch: boolean = true;

export let showSelected: boolean = false;

export let search: (query: string) => Promise<SearchInput[]> = async (_query: string): Promise<SearchInput[]> => {
  return [
    { fyrste: "hei på deg", andre: "oh oh" },
    { fyrste: "tut tut" },
    { fyrste: "tut tut" },
    { fyrste: "tut tut" },
    { fyrste: "tut tut" },
    { fyrste: "tut tut" },
    { fyrste: "tut tut" }
  ];
};

export let callback: (searchRes: SearchInput[]) => void = (_searchRes: SearchInput[]): void => {
  // console.log('callback')
};

export let previewMapper: (input: SearchInput[]) => PreviewItem[] = (input: SearchInput[]): PreviewItem[] => {
  return input.map((ele: SearchInput): PreviewItem => {
    return {
      first: ele.fyrste ?? null,
      second: ele.andre ?? null,
      third: ele.nested?.tredje ?? null,
      onClick: (): void => {
        console.log(`jeg trykket på ${ele.fyrste}`);
      }
    };
  });
};

// state
let focusing: boolean = false;
let previewData: PreviewItem[] = [];
let searchError: string | null = null;
let isSearching: boolean = false;
let timeout: ReturnType<typeof setTimeout> | null = null;

// functions
const clear = (): void => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  isSearching = false;
  previewData = [];
  searchError = null;
};

const clearSearch = (): void => {
  clear();
  searchValue = "";
};

const changeActivePreviewItem = (dir: "up" | "down"): void => {
  if (previewData.length < 2) {
    return;
  }

  const currIndex: number = previewData.findIndex((ele: PreviewItem): boolean => ele.active === true);
  const current: PreviewItem | undefined = previewData[currIndex];
  if (!current) {
    return;
  }

  if (dir === "up") {
    const prev: PreviewItem | undefined = previewData[currIndex - 1];
    if (currIndex > 0 && prev) {
      current.active = false;
      prev.active = true;
    }
  } else if (dir === "down") {
    const next: PreviewItem | undefined = previewData[currIndex + 1];
    if (currIndex < previewData.length - 1 && next) {
      current.active = false;
      next.active = true;
    }
  }
};

// LOLs
const mapPreviewMapper = (mappedPreview: PreviewItem[]): PreviewItem[] => {
  return mappedPreview.map((item: PreviewItem, i: number): PreviewItem => {
    return {
      ...item,
      active: i === 0,
      id: `previewItem-${i}`,
      onClick: (): void => {
        item.onClick();
        if (!showSelected) {
          clearSearch();
          return;
        }

        searchValue = item.first ?? "";
        clear();
      }
    };
  });
};

const onFocus = (): void => {
  if (!focusing) {
    focusing = true;
  }
};

const onBlur = (): void => {
  if (focusing) {
    focusing = false;
  }
};

const onKeydown = (e: KeyboardEvent): void => {
  if (focusing && previewData && previewData.length > 0) {
    if (e.key === "ArrowUp") {
      changeActivePreviewItem("up");
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      changeActivePreviewItem("down");
      e.preventDefault();
    } else if (e.key === "Escape") {
      clear();
      e.preventDefault();
    } else if (e.key === "Enter") {
      previewData.find((ele: PreviewItem): boolean => ele.active === true)?.onClick();
      e.preventDefault();
    }
  }

  if (focusing) {
    if (e.key === "Escape") {
      clear();
      e.preventDefault();
    }
  }
};

const searchFunc = async (): Promise<void> => {
  try {
    const res: SearchInput[] = await search(searchValue);
    isSearching = false;

    if (!Array.isArray(res)) {
      throw new Error("Search function did not return an array. Probably an error were returned");
    }

    if (res.length === 0) {
      throw new Error("Nada users");
    }

    if (showPreview) {
      previewData = mapPreviewMapper(previewMapper(res)); // Hahahah
    }

    callback(res);
  } catch (error) {
    isSearching = false;
    const errStr: string = String(error);
    console.log(errStr);

    const status: number | undefined = (error as { response?: { status?: number } })?.response?.status;

    if (errStr === "Error: Nada users") {
      searchError = `Ingen resultat funnet ved søk på "${searchValue}"... DET ER BJØRN RIIS SIN SKYLD!! 😬`;
    } else if (status === 404) {
      searchError = "Bruker ikke funnet... 😬";
    } else if (status === 401) {
      searchError = "Du har ikke lov å søke på det 🚫";
    } else {
      searchError = "En feil har oppstått - vennligst prøv igjen";
    }
  }

  timeout = null;
};

const debounceSearch = (ms: number = debounceMs): void => {
  if (showPreview) {
    searchError = null;
    isSearching = true;
    // If searchValue is big enough
    if (typeof searchValue === "string" && searchValue.length > 1) {
      // If timeout does not exist already
      if (!timeout) {
        timeout = setTimeout(searchFunc, ms);
        return;
      }

      // If timeout already exist - we restart it
      clearTimeout(timeout);
      timeout = setTimeout(searchFunc, ms);
      return;
    }

    // To small searchstring, we stop the search
    clear();
  }
};
</script>

<div class="searchContainer" use:clickOutside={onBlur}>
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