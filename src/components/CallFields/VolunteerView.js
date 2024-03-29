import React from "react";

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

// function that
async function userlogin() {
    //takes the volunteer input in login box,
    const loginInput = document.querySelector("#Login-input");

    // runs it against query to return the acs user id
    tableservice.retrieveEntity(
        "KioskToken",
        loginInput.value,
        "1",
        async function (error, result, response) {
            if (!error) {
                const AcsUserID = result.Userid._;
                // refreshes the access token for ACS with that user id.
                const userDetailResponse = await refreshACSToken(AcsUserID);
                console.log(userDetailResponse);
                refreshUser(userDetailResponse);

                // and renders the calling controls back on the page
                document
                    .getElementById("volunteerJoin")
                    .classList.remove("ghost");
                document.getElementById("logged").classList.remove("ghost");
                document.getElementById("please").classList.add("ghost");
            }
        }
    );
}
//React.Fragment
class VolunteerView extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <div className="container">
                <div className="input_spacing row_volunteer">
                    <div className="column_left vl-card">
                        <p className="volunteer-login-card " id="please">
                            Please login with your username!
                        </p>
                        <p className="volunteer-login-card ghost" id="logged">
                            You have successfully logged in!
                        </p>
                    </div>
                    <div className="column_middle">
                        <input
                            type="text"
                            id="Login-input"
                            placeholder="Enter Your Username"
                        />

                        <button
                            className="volunteer_button_login"
                            onClick={userlogin}
                            id="Login"
                        >
                            Log in
                        </button>
                    </div>
                    <div className="column_right ghost" id="volunteerJoin">
                        <input
                            type="text"
                            id="callee-input"
                            placeholder="Enter Kiosk To Call"
                        />
                        <br></br>
                        <button
                            className="volunteer_button_start"
                            disabled={false}
                            id="start-call-button"
                            onClick={startCall}
                        >
                            Start Call
                        </button>

                        <button
                            className="volunteer_button_end"
                            disabled={false}
                            id="end-call-button"
                            onClick={endCall}
                        >
                            End Call
                        </button>

                        <button
                            className="volunteer_button_handoff"
                            disabled={false}
                            id="join-group-call-button"
                            onClick={joinGroupCall}
                        >
                            Join Handoff Call
                        </button>
                    </div>
                </div>
                <div className="volunteer-gap"></div>
                <section className="row_volunteer">
                    <div className="videoParent ">
                        <section className="localVideoSectionStyle localVideo">
                            <div
                                id="local-feed-view"
                                className="videoStyle"
                            ></div>
                        </section>

                        <section className="remoteVideoSectionStyle remoteVideo">
                            <div
                                id="remote-feed-view"
                                className="videoStyle"
                            ></div>
                        </section>
                    </div>
                </section>
            </div>
        );
    }
}

export default VolunteerView;
