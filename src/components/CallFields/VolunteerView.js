import React from "react";
// import {
//     CallClient,
//     CallAgent,
//     LocalVideoStream,
//     Renderer,
// } from "@azure/communication-calling";
// import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import "../VideoChat.css";
import "./VolunteerView.css";
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
//React.Fragment
class VolunteerView extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <div className='container'> 
                
                

                <div className="videoParent">
                    <section className="localVideoSectionStyle localVideo">
                        <div id="local-feed-view" className="videoStyle"></div>
                    </section>

                    <section className="remoteVideoSectionStyle remoteVideo">
                        <div id="remote-feed-view" className="videoStyle"></div>
                    </section>
                </div>
                <div className="input_spacing row_volunteer">
                    <div className='column_left'>
                        <input type="text" id="Login-input" />
                        <button className="button_login" onClick={userlogin} id="Login">
                            Log in
                        </button>
                    </div>
                    <div className='column_right'>
                        <br />
                        <input type="text" id="callee-input" />
                        <button
                            className='button_login'
                            disabled={false}
                            id="start-call-button"
                            onClick={startCall}
                        >
                            Start Call
                        </button>

                        <button 
                            className='button_login'
                            disabled={false} 
                            id="end-call-button" 
                            onClick={endCall}>
                            End Call
                        </button>
                    </div>
                </div>
                    <br />
                    <button
                        className='button_handoff'
                        disabled={false}
                        id="join-group-call-button"
                        onClick={joinGroupCall}
                    >
                        Join Handoff Call
                    </button>
                
            </div>
        );
    }
}
// export default UserFetchField;
export default VolunteerView;
