import React, { useState } from "react";
import {
    CallClient,
    CallAgent,
    LocalVideoStream,
    Renderer,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let call;
let callAgent;
let deviceManager;
let cameras;
let videoDeviceInfo;
let localVideoStream;
let placeCallOptions;

// const incomingCallHander = async () => {
//     //Get information about caller

//     let callerInfo = incomingCall.callerInfo;

//     //accept the call
//     call = await incomingCall.accept();

//     //reject the call
//     incomingCall.reject();
// };

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
    call = callAgent.startCall(
        [{ communicationUserId: userToCall }],
        placeCallOptions
    );
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

//TODO - not displaying the video feed
function subscribeToRemoteVideoStream(remoteVideoStream) {
    let renderer = new Renderer(remoteVideoStream);
    const displayVideo = async () => {
        const view = await renderer.createView();
        // const videoFeedView = document.getElementById("#video-feed-view");
        document.body.appendChild(view.target);
    };
    remoteVideoStream.on("availabilityChanged", async () => {
        if (remoteVideoStream.isAvailable) {
            displayVideo();
        } else {
            renderer.dispose();
        }
    });
    if (remoteVideoStream.isAvailable) {
        displayVideo();
    }
}

const UserFetchField = () => {
    const [userID, setUserID] = useState("UserID Here");

    const provisionUser = async () => {
        const userDetailResponse = await fetchNewUser();
        console.log(userDetailResponse);
        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(
            userDetailResponse.token
        );
        callAgent = await callClient.createCallAgent(tokenCredential, {
            displayName: "Testing Callee",
        });
        deviceManager = await callClient.getDeviceManager();
        cameras = await deviceManager.getCameras();
        videoDeviceInfo = cameras[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        placeCallOptions = {
            videoOptions: { localVideoStreams: [localVideoStream] },
        };
        callAgent.on("incomingCall", async (args) => {
            //subscribe to the video stream

            // accept the incoming call
            call = await args.incomingCall.accept();
            const remoteVideoStream =
                call.remoteParticipants[0].videoStreams[0];
            console.log(remoteVideoStream);
            subscribeToRemoteVideoStream(remoteVideoStream);
            // // or reject the incoming call
            // args.incomingCall.reject();
        });
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
            <section id="video-feed-view"></section>
        </React.Fragment>
    );
};

export default UserFetchField;
