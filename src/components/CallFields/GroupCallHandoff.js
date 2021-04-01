import React from "react";

import "../VideoChat.css";
import {
    provisionUser,
    joinGroupCall,
    endCall,
} from "../../utilities/callingUtils";

class GroupCallHandoff extends React.Component {
    componentDidMount() {
        provisionUser();
        console.log(window.location.href);
    }
    render() {
        return (
            <React.Fragment>
                <button
                    disabled={false}
                    id="join-group-call-button"
                    onClick={joinGroupCall}
                >
                    Join Handoff Call
                </button>
                <button disabled={false} id="end-call-button" onClick={endCall}>
                    End Call
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
    }
}
export default GroupCallHandoff;
