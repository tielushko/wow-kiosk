import React, { useState } from "react";
import {
    CallClient,
    CallAgent,
    LocalVideoStream,
    Renderer,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import "./VideoChat.css";
import {
    searchKiosk,
    saveToken,
    createTable,
    getuserid,
    tableservice,
} from "./TableFunctions";

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
// let cameras;
// let videoDeviceInfo;
let placeCallOptions;
//for rendering the video of local and the remote caller
let localRenderer;
let remoteRenderer;
let remoteVideoStream;
let localVideoStream;

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

const startCall = async () => {
    const cameras = await deviceManager.getCameras();
    const videoDeviceInfo = cameras[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {
        videoOptions: { localVideoStreams: [localVideoStream] },
    };

    localVideoView();

    const calleeInput = document.querySelector("#callee-input");

    tableservice.retrieveEntity(
        "KioskToken",
        calleeInput.value,
        "1",
        function (error, result, response) {
            if (!error) {
                const aUserToCall = result.Userid._;
                call = callAgent.startCall(
                    [{ communicationUserId: aUserToCall }],
                    placeCallOptions
                );
                subscribeToRemoteParticipantInCall(call);
            }
        }
    );
};

const endCall = async () => {
    // end the current call
    localRenderer.dispose();
    if (remoteRenderer) {
        remoteRenderer.dispose();
    }
    await call.hangUp(/*{ forEveryone: true }*/);
};

const joinGroupCall = async () => {
    const cameras = await deviceManager.getCameras();
    const videoDeviceInfo = cameras[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {
        videoOptions: { localVideoStreams: [localVideoStream] },
    };

    localVideoView();

    const groupCallInput = document.querySelector("#group-call-input");
    const groupToCall = { groupId: groupCallInput.value };
    call = callAgent.join(groupToCall, placeCallOptions);

    subscribeToRemoteParticipantInCall(call);
};

const joinTeamsMeeting = async () => {
    const cameras = await deviceManager.getCameras();
    const videoDeviceInfo = cameras[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {
        videoOptions: { localVideoStreams: [localVideoStream] },
    };

    localVideoView();
    const teamsMetingInput = document.querySelector("#teams-meeting-input");
    const meetingToCall = { meetingLink: teamsMetingInput.value };
    call = callAgent.join(meetingToCall, placeCallOptions);

    subscribeToRemoteParticipantInCall(call);
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
    remoteVideoStream.on("isAvailableChanged", async () => {
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

async function userlogin(username) {
    const loginInput = document.querySelector("#Login-input");
    tableservice.retrieveEntity(
        "KioskToken",
        loginInput.value,
        "1",
        async function (error, result, response) {
            if (!error) {
                const AcsUserID = result.Userid._;
                const userDetailResponse = await refreshACSToken(AcsUserID);
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

                // subscribing to an incoming call event -> fires whenever we are receiving an incoming call
                callAgent.on("incomingCall", async (args) => {
                    const cameras = await deviceManager.getCameras();
                    const videoDeviceInfo = cameras[0];
                    localVideoStream = new LocalVideoStream(videoDeviceInfo);
                    localVideoView();
                    const addedCall = await args.incomingCall.accept({
                        videoOptions: { localVideoStreams: [localVideoStream] },
                    });
                    // accept the incoming call
                    call = addedCall;

                    subscribeToRemoteParticipantInCall(addedCall);
                    // or reject the incoming call
                    // args.incomingCall.reject();
                });

                callAgent.on("callsUpdated", (e) => {
                    e.removed.forEach((removedCall) => {
                        // dispose of video renders
                        localRenderer.dispose();
                        remoteRenderer.dispose();
                    });
                });
            }
        }
    );
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

        // subscribing to an incoming call event -> fires whenever we are receiving an incoming call
        callAgent.on("incomingCall", async (args) => {
            const cameras = await deviceManager.getCameras();
            const videoDeviceInfo = cameras[0];
            localVideoStream = new LocalVideoStream(videoDeviceInfo);
            localVideoView();
            const addedCall = await args.incomingCall.accept({
                videoOptions: { localVideoStreams: [localVideoStream] },
            });
            // accept the incoming call
            call = addedCall;

            subscribeToRemoteParticipantInCall(addedCall);
            // or reject the incoming call
            // args.incomingCall.reject();
        });

        callAgent.on("callsUpdated", (e) => {
            e.removed.forEach((removedCall) => {
                // dispose of video renders
                localRenderer.dispose();
                remoteRenderer.dispose();
            });
        });

        setUserID(userDetailResponse.userID);
    };
    return (
        <React.Fragment>
            <h2>{userID}</h2>
            <button onClick={userlogin} id="Login">
                Log in
            </button>
            <input type="text" id="Login-input" />

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

            <div className="videoParent">
                <section className="localVideoSectionStyle localVideo">
                    <div id="local-feed-view" className="videoStyle"></div>
                </section>

                <section className="remoteVideoSectionStyle remoteVideo">
                    <div id="remote-feed-view" className="videoStyle"></div>
                </section>
            </div>
        </React.Fragment>
    );
};
//<h2>Local Video</h2>
//<div></div>
//<h2>Remote Video</h2>

export default UserFetchField;
