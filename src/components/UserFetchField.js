import React, { useState } from "react";
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import './VideoChat.css'
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
        <React.Fragment className='streamContainer'>
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

            <div className='videoParent'>
                <section 
                //style={videoSectionStyle}
                className='localVideoSectionStyle localVideo'
                >
                    <div id="local-feed-view" 
                    //style={videoStyle}
                    className='videoStyle'
                    ></div>
                </section>
                
                <section 
                //style={videoSectionStyle}
                className='remoteVideoSectionStyle remoteVideo'
                >
                    <div id="remote-feed-view" 
                    //style={videoStyle}
                    className='videoStyle'
                    ></div>
                </section>
            </div>
        </React.Fragment>
    );
};
//<h2>Local Video</h2>
//<div></div>
//<h2>Remote Video</h2>

export default UserFetchField;
