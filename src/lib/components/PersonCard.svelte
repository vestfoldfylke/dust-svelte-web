<script lang="ts">
import Confetti from "svelte-confetti";
import type { ReportUser } from "$lib/types/search";
import InitialsBadge from "./InitialsBadge.svelte";

export let user: ReportUser;

const hasBirthdayToday = (reportUser: ReportUser): boolean => {
  const date: number = Number.parseInt(reportUser.employeeNumber?.substring(0, 2) ?? "0");
  const month: number = Number.parseInt(reportUser.employeeNumber?.substring(2, 4) ?? "-1");
  const today: Date = new Date();

  return date === today.getDate() && month === today.getMonth() + 1;
};

const getInitialsFromName = (reportUser: ReportUser): string => {
  if (hasBirthdayToday(reportUser)) {
    return "🥳";
  }

  const lastSpaceIndex: number = reportUser.displayName.lastIndexOf(" ");

  return `${reportUser.displayName.substring(0, 1)} ${reportUser.displayName.substring(lastSpaceIndex + 1, lastSpaceIndex + 2)}`;
};

const numberOfConfetti = (reportUser: ReportUser): number => {
  const userYear: number = Number.parseInt(reportUser.employeeNumber?.substring(4, 6) ?? "0");

  const today: Date = new Date();
  const currentYear: number = today.getFullYear() % 100; // Get last two digits of current year

  // If userYear is greater than currentYear, it means the user was born in the previous century
  return userYear > currentYear ? 100 - userYear + currentYear : currentYear - userYear;
};
</script>

<div class="personCard">
    <div class="userHeader">
        <div class="userBadge">
            <InitialsBadge size='large' initials={getInitialsFromName(user)} />
        </div>
        <div class="mainStuff">
            <div class="userTitle">
                <div class="smallBadge">
                    <InitialsBadge size='small' initials={getInitialsFromName(user)} />
                </div>
                <h2>{user.displayName}</h2>
            </div>
            <h3 class="upn">
                {user.userPrincipalName}
            </h3>

            {#if hasBirthdayToday(user)}
                <Confetti iterationCount={10} amount={numberOfConfetti(user)} duration={2500} delay={[0, 1000]} x={[0,4]} />
            {/if}

            <p>{user.samAccountName || (user.feidenavn ? user.feidenavn.substring(0, user.feidenavn.indexOf('@')) : '??? samAccountName ? feidenavn??')}</p>
            <p>{user.companyName}</p>
            <p>{user.jobTitle}</p>
        </div>
    </div>
</div>
{#if user.extraCaution}
    <div class="cautionBox">
        <span class="cautionIcon">⚠️</span><span>SVAR: "Jeg finner ingen brukere med det navnet i systemet vårt"</span>
            <!--
            {#if import.meta.env.VITE_EXTRA_CAUTION_LINK}
                <a href="{import.meta.env.VITE_EXTRA_CAUTION_LINK}" target="_blank">Mer informasjon.</a>
            {/if}
            -->
    </div>
{/if}

<style>
    .personCard {
        padding: 50px 20px;
    }
    .userHeader {
        display: flex;
    }
    .userBadge {
        margin-right: 32px;
    }
    .smallBadge {
        display: none;
        margin-right: 8px;
    }
    .userTitle {
        display: flex;
        align-items: center;
        margin-bottom: inherit;
    }
    .upn {
        margin-bottom: 6px;
    }
    .cautionBox {
        border: 5px solid #ec4d5d;
        padding: 0.5rem;
        margin-bottom: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    .cautionIcon {
        font-size: 2rem;
    }
    @media(max-width: 885px) {
        .userBadge {
            display: none;
        }
        .smallBadge {
            display: block;
        }
        .userTitle {
            margin-bottom: 8px;
        }
    }

</style>