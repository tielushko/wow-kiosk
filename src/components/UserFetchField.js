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

const startCall = () => {
    const calleeInput = document.querySelector("#callee-input");
    const userToCall = calleeInput.value;
    call = callAgent.startCall([{ communicationUserId: userToCall }], {});
};

const endCall = () => {
    // end the current call
    call.hangUp({ forEveryone: true });
};

const joinGroupCall = () => {
    const groupCallInput = document.querySelector("#group-call-input");
    const groupToCall = { groupId: groupCallInput.value };
    call = callAgent.join(groupToCall);
};

const joinTeamsMeeting = () => {
    const teamsMetingInput = document.querySelector("#teams-meeting-input");
    const meetingToCall = { meetingLink: teamsMetingInput.value };
    call = callAgent.join(meetingToCall, {});
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
            <button onClick={provisionUser} id="provision-user-button">
                Provision User
            </button>
            <input type="text" id="callee-input" />
            <button disabled={false} id="start-call-button" onClick={startCall}>
                Start Call
            </button>

            <button disabled={false} id="end-call-button" onClick={endCall}>
                End Call
            </button>
            <br />
            <input type="text" id="group-call-input" />
            <button
                disabled={false}
                id="join-group-call-button"
                onClick={joinGroupCall}
            >
                Join Group Call
            </button>
            <br />
            <input type="text" id="teams-meeting-input" />
            <button
                disabled={false}
                id="join-teams-meeting-button"
                onClick={joinTeamsMeeting}
            >
                Join Teams Meeting
            </button>
        </React.Fragment>
    );
};

export default UserFetchField;
