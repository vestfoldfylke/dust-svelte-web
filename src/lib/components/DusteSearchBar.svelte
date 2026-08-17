<script lang="ts">
import { goto } from "$app/navigation";
import type { ReportUser } from "$lib/types/search";
import { createReport, userSearch } from "../useApi.js";
import SearchBar from "./SearchBar.svelte";

type PreviewMapping = {
  first: string | null;
  second: string;
  third: string | null;
  onClick: () => Promise<void>;
};

const searchFunc = async (query: string): Promise<ReportUser[]> => {
  return ((await userSearch(query))?.data ?? []) as ReportUser[];
};

const createNewReport = async (user: ReportUser): Promise<void> => {
  const reportId: string | undefined = (await createReport(user))?.data as string;
  if (!reportId) {
    throw new Error('Report for user not created');
  }

  goto(`/report/${reportId}`, { replaceState: false, invalidateAll: true });
};

const previewMapper = (input: ReportUser[]): PreviewMapping[] => {
  return input.map((user: ReportUser): PreviewMapping => {
    let userEmoji: string;
    if (user.jobTitle && ["Elev", "Lærling"].includes(user.jobTitle)) {
      userEmoji = "🎓";
    } else if (user.jobTitle === null) {
      userEmoji = "🤷‍♂️";
    } else {
      userEmoji = "🤓";
    }

    let secondUsername: string;
    if (user.samAccountName) {
      secondUsername = user.samAccountName;
    } else if (user.feidenavn) {
      secondUsername = user.feidenavn.substring(0, user.feidenavn.indexOf("@"));
    } else {
      secondUsername = "???";
    }

    return {
      first: user.displayName ?? null,
      second: `${userEmoji} ${secondUsername} (${user.userType})`,
      third: user.companyName ?? null,
      onClick: async (): Promise<void> => {
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
