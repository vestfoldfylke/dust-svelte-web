<script>
import { goto } from "$app/navigation";
import { createReport, userSearch } from "../useApi.js";
import SearchBar from "./SearchBar.svelte";

const searchFunc = async (query) => {
  return (await userSearch(query)).data;
};
const searchCallback = (searchRes) => {
  // Do something with the searchCallback if you want
};
const createNewReport = async (user) => {
  const reportId = (await createReport(user)).data;
  goto(`/report/${reportId}`, { replaceState: false, invalidateAll: true });
};
const previewMapper = (input) => {
  return input.map((user) => {
    let userEmoji;
    if (["Elev", "Lærling"].includes(user.jobTitle)) userEmoji = "🎓";
    else if ([null].includes(user.title)) userEmoji = "🤷‍♂️";
    else userEmoji = "🤓";
    const secondUsername = user.samAccountName
      ? user.samAccountName
      : user.feidenavn
        ? user.feidenavn.substring(0, user.feidenavn.indexOf("@"))
        : "???";
    return {
      first: user.displayName,
      second: `${userEmoji} ${secondUsername} (${user.userType})`,
      third: user.companyName,
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