<script lang="ts">
import { goto } from "$app/navigation";
import { createReport, userSearch } from "../useApi.js";
import SearchBar from "./SearchBar.svelte";

type SearchUser = Record<string, unknown> & {
  _id?: string;
  displayName?: string;
  jobTitle?: string;
  title?: string | null;
  samAccountName?: string;
  feidenavn?: string;
  userType?: string;
  companyName?: string;
};

const searchFunc = async (query: string): Promise<SearchUser[]> => {
  return ((await userSearch(query)).data ?? []) as SearchUser[];
};
const createNewReport = async (user: SearchUser): Promise<void> => {
  const reportId = (await createReport({ _id: user._id ?? "" })).data;
  goto(`/report/${reportId}`, { replaceState: false, invalidateAll: true });
};
const previewMapper = (input: SearchUser[]) => {
  return input.map((user) => {
    let userEmoji: string;
    if (user.jobTitle && ["Elev", "Lærling"].includes(user.jobTitle)) userEmoji = "🎓";
    else if (user.title === null) userEmoji = "🤷‍♂️";
    else userEmoji = "🤓";
    const secondUsername = user.samAccountName
      ? user.samAccountName
      : user.feidenavn
        ? user.feidenavn.substring(0, user.feidenavn.indexOf("@"))
        : "???";
    return {
      first: user.displayName ?? null,
      second: `${userEmoji} ${secondUsername} (${user.userType})`,
      third: user.companyName ?? null,
      onClick: async () => {
        await createNewReport(user);
      }
    };
  });
};
</script>

<div class="dusteSearchBar">
    <SearchBar rounded={true} debounceMs={1000} showPreview={true} placeholder="Søk her" search={searchFunc} previewMapper={previewMapper} />
</div>

<style>
  .dusteSearchBar {
    margin: auto;
    max-width: 800px;
  }
</style>