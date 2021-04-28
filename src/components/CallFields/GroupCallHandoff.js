import React from "react";

// import "../VideoChat.css";
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
            <div className='handContainer'>
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
                <p className='handoffText'>Please rotate screen for call</p>
                <section className='row_handoff'>
                    <div className="videoParent videoHandoff">
                        <section className="handLocalVideoSectionStyle handLocalVideo">
                            <div id="local-feed-view" className="handVideoStyle"></div>
                        </section>

                        <section className="handRemoteVideoSectionStyle handRemoteVideo">
                            <div id="remote-feed-view" className="handVideoStyle"></div>
                        </section>
                    </div>
                </section>
            </div>
        );
    }
}
export default GroupCallHandoff;
