import React from "react";

import "../VideoChat.css";
import "./GroupCallHandoff.css";
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
            <div className='container'>
                <button
                    className='handoff_button_join-handoff'
                    disabled={false}
                    id="join-group-call-button"
                    onClick={joinGroupCall}
                >
                    Join Handoff Call
                </button>
                <button
                    className='handoff_button_end' 
                    disabled={false} 
                    id="end-call-button" 
                    onClick={endCall}>
                    End Call
                </button>
                <section className='row_handoff'>
                    <div className="videoParent videoHandoff">
                        <section className="localVideoSectionStyle localVideo">
                            <div id="local-feed-view" className="videoStyle"></div>
                        </section>

                        <section className="remoteVideoSectionStyle remoteVideo">
                            <div id="remote-feed-view" className="videoStyle"></div>
                        </section>
                    </div>
                </section>
            </div>
        );
    }
}
export default GroupCallHandoff;
