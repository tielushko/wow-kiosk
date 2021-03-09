import React, { useState } from "react";
import {
    CallClient,
    CallAgent,
    LocalVideoStream,
    Renderer,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
// import StreamVideo from "../pages/Livevideo/StreamVideo";

const videoSectionStyle = {
    height: "200px",
    width: "300px",
    backgroundColor: "black",
    position: "relative",
};
const videoStyle = {
    backgroundColor: "black",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
};

let call;
let callAgent;
let deviceManager;
let cameras;
let videoDeviceInfo;
let placeCallOptions;
//for rendering the video of the remote caller
let localRenderer;
let remoteRenderer;
let remoteVideoStream;
let localVideoStream;

// fetching from the user-provisioning api
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
    subscribeToRemoteParticipantInCall(call);
};

const endCall = () => {
    // end the current call
    call.hangUp(/*{ forEveryone: true }*/);
};

const joinGroupCall = () => {
    const groupCallInput = document.querySelector("#group-call-input");
    const groupToCall = { groupId: groupCallInput.value };
    call = callAgent.join(groupToCall, placeCallOptions);
};

const joinTeamsMeeting = () => {
    const teamsMetingInput = document.querySelector("#teams-meeting-input");
    const meetingToCall = { meetingLink: teamsMetingInput.value };
    call = callAgent.join(meetingToCall, placeCallOptions);
};

function subscribeToRemoteParticipantInCall(callInstance) {
    callInstance.remoteParticipants.forEach((p) => {
        subscribeToRemoteParticipant(p);
    });
    callInstance.on("remoteParticipantsUpdated", (e) => {
        e.added.forEach((p) => {
            subscribeToRemoteParticipant(p);
        });
    });
}

function subscribeToRemoteParticipant(remoteParticipant) {
    remoteParticipant.videoStreams.forEach((v) => {
        handleVideoStream(v);
    });
    remoteParticipant.on("videoStreamsUpdated", (e) => {
        e.added.forEach((v) => {
            handleVideoStream(v);
        });
    });
}

function handleVideoStream(remoteVideoStream) {
    remoteVideoStream.on("availabilityChanged", async () => {
        if (remoteVideoStream.isAvailable) {
            remoteVideoView(remoteVideoStream);
        } else {
            remoteRenderer.dispose();
        }
    });
    if (remoteVideoStream.isAvailable) {
        remoteVideoView(remoteVideoStream);
    }
}

async function remoteVideoView(remoteVideoStream) {
    remoteRenderer = new Renderer(remoteVideoStream);
    const view = await remoteRenderer.createView();
    document.getElementById("remote-feed-view").appendChild(view.target);
}

async function localVideoView() {
    localRenderer = new Renderer(localVideoStream);
    const view = await localRenderer.createView();
    document.getElementById("local-feed-view").appendChild(view.target);
}

const UserFetchField = () => {
    const [userID, setUserID] = useState("UserID Here");

    const provisionUser = async () => {
        //fetching API object from the backend
        const userDetailResponse = await fetchNewUser();
        console.log(userDetailResponse);

        //initializing the calling client and setting the token credential - creating callAgent.
        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(
            userDetailResponse.token
        );
        callAgent = await callClient.createCallAgent(tokenCredential, {
            displayName: "Testing Callee",
        });

        //creating the local video stream to be sent with the application
        deviceManager = await callClient.getDeviceManager();
        cameras = await deviceManager.getCameras();
        videoDeviceInfo = cameras[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        placeCallOptions = {
            videoOptions: { localVideoStreams: [localVideoStream] },
        };

        // subscribing to an incoming call event -> fires whenever we are receiving an incoming call
        callAgent.on("incomingCall", async (args) => {
            // accept the incoming call
            call = await args.incomingCall.accept(placeCallOptions);

            // const remoteVideoStream =
            //     call.remoteParticipants[0].videoStreams[0];
            // console.log(remoteVideoStream);
            // subscribeToRemoteVideoStream(remoteVideoStream);
            // or reject the incoming call
            // args.incomingCall.reject();
        });

        localVideoView();
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

            <div>Local Video</div>
            <section style={videoSectionStyle}>
                <div id="local-feed-view" style={videoStyle}></div>
            </section>
            <div></div>
            <div>Remote Video</div>
            <section style={videoSectionStyle}>
                <div id="remote-feed-view" style={videoStyle}></div>
            </section>
        </React.Fragment>
    );
};

export default UserFetchField;
