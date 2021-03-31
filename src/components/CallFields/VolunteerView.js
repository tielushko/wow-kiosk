import React from "react";
// import {
//     CallClient,
//     CallAgent,
//     LocalVideoStream,
//     Renderer,
// } from "@azure/communication-calling";
// import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import "../VideoChat.css";
import { tableservice } from "../../utilities/TableFunctions";

import { refreshACSToken } from "../../utilities/utils";
import {
    startCall,
    joinGroupCall,
    endCall,
    refreshUser,
} from "../../utilities/callingUtils";

async function userlogin() {
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
                refreshUser(userDetailResponse);
            }
        }
    );
}

class VolunteerView extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <React.Fragment>
                <button onClick={userlogin} id="Login">
                    Log in
                </button>
                <input type="text" id="Login-input" />
                <br />
                {/* <button onClick={provisionUser} id="provision-user-button">
                Provision User
            </button> */}
                <input type="text" id="callee-input" />
                <button
                    disabled={false}
                    id="start-call-button"
                    onClick={startCall}
                >
                    Start Call
                </button>

                <button disabled={false} id="end-call-button" onClick={endCall}>
                    End Call
                </button>
                <br />
                <button
                    disabled={false}
                    id="join-group-call-button"
                    onClick={joinGroupCall}
                >
                    Join Handoff Call
                </button>
                <br />

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
    }
}
// export default UserFetchField;
export default VolunteerView;
