import { fetchNewUser } from "./utils";
import { tableservice } from "./TableFunctions";

import { AzureLogger } from "@azure/logger";
import {
    CallClient,
    LocalVideoStream,
    Renderer,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import "../components/VideoChat.css";
import "../pages/Home/Home.css"

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

export async function remoteVideoView(remoteVideoStream) {
    remoteRenderer = new Renderer(remoteVideoStream);
    const view = await remoteRenderer.createView();
    document.getElementById("remote-feed-view").appendChild(view.target);
}

export async function localVideoView() {
    localRenderer = new Renderer(localVideoStream);
    const view = await localRenderer.createView();
    document.getElementById("local-feed-view").appendChild(view.target);
}

export const startCall = async () => {
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

export const joinGroupCall = async () => {
    const cameras = await deviceManager.getCameras();
    const videoDeviceInfo = cameras[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {
        videoOptions: { localVideoStreams: [localVideoStream] },
    };

    localVideoView();

    // const groupCallInput = document.querySelector("#group-call-input");
    // const groupToCall = { groupId: groupCallInput.value };
    const groupToCall = { groupId: "c65edd6b-a68b-4434-b443-e36832261595" };
    call = callAgent.join(groupToCall, placeCallOptions);

    subscribeToRemoteParticipantInCall(call);
};

export const endCall = async () => {
    // end the current call
    localRenderer.dispose();
    if (remoteRenderer) {
        remoteRenderer.dispose();
    }
    await call.hangUp(/*{ forEveryone: true }*/);
};
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
};

export const refreshUser = async (userDetailResponse) => {
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
