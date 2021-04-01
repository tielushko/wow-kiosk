// fetching from the user-provisioning api
const fetchNewUser = async () => {
    const tokenURL =
        "https://wow-kiosk-tokens.azurewebsites.net/api/wow-kiosk-tokens";
    let response = await fetch(tokenURL);
    if (response.ok) {
        return response.json();
    }
};

//function that takes in the userID and fetches the refreshed access token for the ACS API - for Wilson.
const refreshACSToken = async (userID) => {
    const tokenURL = `https://wow-tokens-refresh.azurewebsites.net/api/user/${userID}/refresh`;
    let response = await fetch(tokenURL);
    if (response.ok) {
        return response.json();
    }
};


export { fetchNewUser, refreshACSToken };
