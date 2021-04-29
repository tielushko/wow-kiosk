import { fetchNewUser } from "./utils";
import { tableservice } from "./TableFunctions";

//azure logger does not affect functionality, it is here for console debugging - could be removed for production.
import { AzureLogger } from "@azure/logger";
import {
    CallClient,
    LocalVideoStream,
    Renderer,
} from "@azure/communication-calling";

import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import "../components/VideoChat.css";
import "../pages/Home/Home.css";

/* Logger stuff is optional, use for dev only. */
AzureLogger.verbose = (...args) => {
    console.info(...args);
};
AzureLogger.info = (...args) => {
    console.info(...args);
};
AzureLogger.warning = (...args) => {
    console.info(...args);
};
AzureLogger.error = (...args) => {
    console.info(...args);
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

export {
    call,
    callAgent,
    deviceManager,
    placeCallOptions,
    localRenderer,
    remoteRenderer,
    remoteVideoStream,
    localVideoStream,
};

// subscribe the call to remote participants - need for rendering remote video later on in code
export function subscribeToRemoteParticipantInCall(callInstance) {
    callInstance.remoteParticipants.forEach((p) => {
        subscribeToRemoteParticipant(p);
    });
    callInstance.on("remoteParticipantsUpdated", (e) => {
        e.added.forEach((p) => {
            subscribeToRemoteParticipant(p);
        });
    });
}

// as remote participants are added in the call, their video streams need to be "handled"
export function subscribeToRemoteParticipant(remoteParticipant) {
    remoteParticipant.videoStreams.forEach((v) => {
        handleVideoStream(v);
    });
    remoteParticipant.on("videoStreamsUpdated", (e) => {
        e.added.forEach((v) => {
            handleVideoStream(v);
        });
    });
}

// this function uses the stream 'isAvailableChanged' event to create a remote video view for each remote participant
// that has their camera enabled, otherwise it is disposed when they turn camera off
export function handleVideoStream(remoteVideoStream) {
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

// actual render of the REMOTE VIDEO stream and linking it to a container on the webpage.
export async function remoteVideoView(remoteVideoStream) {
    remoteRenderer = new Renderer(remoteVideoStream);
    const view = await remoteRenderer.createView();
    document.getElementById("remote-feed-view").appendChild(view.target);
}

// actual render of the LOCAL VIDEO stream and linking it to a container on the webpage.
export async function localVideoView() {
    localRenderer = new Renderer(localVideoStream);
    const view = await localRenderer.createView();
    document.getElementById("local-feed-view").appendChild(view.target);
}

// function that gets called upon pressing the call button
export const startCall = async () => {
    // cameras - a list of cameras available on the device, with this info, the streams are created, passed in the
    // placeCallOptions and then rendered on the screen
    const cameras = await deviceManager.getCameras();
    const videoDeviceInfo = cameras[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {
        videoOptions: { localVideoStreams: [localVideoStream] },
    };

    localVideoView();

    // get the user to call from input box.
    const calleeInput = document.querySelector("#callee-input");

    // match the information typed in the box to an existing user in the database, to retrieve their ACS user id.
    // Actual calls can only be placed through that ACS User ID.
    tableservice.retrieveEntity(
        "KioskToken",
        calleeInput.value,
        "1",
        function (error, result, response) {
            if (!error) {
                const aUserToCall = result.Userid._;

                // initiation of the call with aUserToCall and passed in video through place call options.
                call = callAgent.startCall(
                    [{ communicationUserId: aUserToCall }],
                    placeCallOptions
                );

                // function call for the handling of the remote participants in call.
                subscribeToRemoteParticipantInCall(call);
            }
        }
    );
};

// joinGroupCall works in similar way as joinCall but instead we use GUID as the groupToCall field.
export const joinGroupCall = async () => {
    const cameras = await deviceManager.getCameras();
    const videoDeviceInfo = cameras[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {
        videoOptions: { localVideoStreams: [localVideoStream] },
    };

    localVideoView();

    const groupToCall = { groupId: "c65edd6b-a68b-4434-b443-e36832261595" };
    call = callAgent.join(groupToCall, placeCallOptions);

    subscribeToRemoteParticipantInCall(call);
};

// hang up functionality - disposes of the rendered video streams, and calls the hang up method.
// Use the forEveryone: true to end call for all participants
export const endCall = async () => {
    // end the current call
    localRenderer.dispose();
    if (remoteRenderer) {
        remoteRenderer.dispose();
    }
    await call.hangUp(/*{ forEveryone: true }*/);
};

// function uses the call to wow-kiosk-tokens for generation of new ACS user id and instantiating the calling client
// form ACS
export const provisionUser = async () => {
    //fetching API object from the backend
    const userDetailResponse = await fetchNewUser();
    console.log(userDetailResponse);

    //initializing the calling client and setting the token credential - creating callAgent.
    const callClient = new CallClient({ logger: AzureLogger });
    const tokenCredential = new AzureCommunicationTokenCredential(
        userDetailResponse.token
    );
    if (!callAgent) {
        callAgent = await callClient.createCallAgent(tokenCredential, {
            displayName: "Testing Callee",
        });
    }

    //creating the local video stream to be sent with the application
    deviceManager = await callClient.getDeviceManager();

    // subscribing to an incoming call event -> fires whenever we are receiving an incoming call
    callAgent.on("incomingCall", async (args) => {
        const cameras = await deviceManager.getCameras();
        console.log(cameras);
        const videoDeviceInfo = cameras[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        localVideoView();
        const addedCall = await args.incomingCall.accept({
            videoOptions: { localVideoStreams: [localVideoStream] },
        });
        // accept the incoming call
        call = addedCall;

        // subscribe to remote video streams and render them.
        subscribeToRemoteParticipantInCall(addedCall);
        // or reject the incoming call
        // args.incomingCall.reject();
    });

    // handle the video streams when members of call leave the room -> dispose of their streams.
    callAgent.on("callsUpdated", (e) => {
        e.removed.forEach((removedCall) => {
            // dispose of video renders
            localRenderer.dispose();
            remoteRenderer.dispose();
        });
    });
};

// function that uses particular ACS user respoonse with refreshed token, and instantiates the calling client and agent
export const refreshUser = async (userDetailResponse) => {
    //initialize the client
    const callClient = new CallClient({ logger: AzureLogger });
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
        console.log(cameras);
        const videoDeviceInfo = cameras[0];
        localVideoStream = new LocalVideoStream(videoDeviceInfo);
        localVideoView();

        const addedCall = await args.incomingCall.accept({
            videoOptions: { localVideoStreams: [localVideoStream] },
        });
        // accept the incoming call
        call = addedCall;
        document.getElementById("homeKiosk").classList.remove("ghost"); //This will add the video window when call is incoming

        subscribeToRemoteParticipantInCall(addedCall);
        // or reject the incoming call
        // args.incomingCall.reject();
        // if (addedCall){
        //     document.getElementById("kioskVideo").classList.add("ghost"); //This will add the video window when call is incoming
        // }
    });

    callAgent.on("callsUpdated", (e) => {
        e.removed.forEach((removedCall) => {
            // dispose of video renders
            localRenderer.dispose();
            remoteRenderer.dispose();
            document.getElementById("homeKiosk").classList.add("ghost"); //This will add the video window when call is incoming
        });
    });
};
