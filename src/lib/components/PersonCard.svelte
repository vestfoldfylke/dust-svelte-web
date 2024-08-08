<script>
    import InitialsBadge from "./InitialsBadge.svelte";

    export let user

    const getInitialsFromName = (displayName) => {
        const lastSpaceIndex = displayName.lastIndexOf(' ')
        return `${displayName.substring(0,1)} ${displayName.substring(lastSpaceIndex+1, lastSpaceIndex+2)}`
    }
</script>

<div class="personCard">
    <div class="userHeader">
        <div class ="userBadge">
            <InitialsBadge size='large' initials={getInitialsFromName(user.displayName)} />
        </div>
        <div class="mainStuff">
            <div class="userTitle">
                <div class="smallBadge">
                    <InitialsBadge size='small' initials={getInitialsFromName(user.displayName)} />
                </div>
                <h2>{user.displayName}</h2>
            </div>
            <h3 class="upn">
                {user.userPrincipalName}
            </h3>

            <p>{user.samAccountName || (user.feidenavn ? user.feidenavn.substring(0, user.feidenavn.indexOf('@')) : '??? samaccount ? feidenavn??')}</p>
            <p>{user.companyName}</p>
            <p>{user.jobTitle}</p>
        </div>
    </div>
</div>

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