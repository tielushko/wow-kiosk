import React, { useState } from "react";
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let call;
let callAgent;

const fetchNewUser = async () => {
    const tokenURL =
        "https://wow-kiosk-trusted-token-provisioning.azurewebsites.net/api/WoW-Kiosk-Trusted-Token-Provisioning";
    let response = await fetch(tokenURL);
    if (response.ok) {
        return response.json();
    }
};

const UserFetchField = () => {
    const [userID, setUserID] = useState("UserID Here");

    const provisionUser = async () => {
        const userDetailResponse = await fetchNewUser();
        console.log(userDetailResponse);

        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(
            userDetailResponse.token
        );
        callAgent = await callClient.createCallAgent(tokenCredential);

        setUserID(userDetailResponse.userID);
    };
    return (
        <React.Fragment>
            <h2>{userID}</h2>
            <button onClick={provisionUser}>Provision User</button>
        </React.Fragment>
    );
};

export default UserFetchField;
