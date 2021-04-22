import React from "react";

import "../VideoChat.css";
import "./KioskView.css"
import {
    provisionUser,
    joinGroupCall,
    endCall,
    refreshUser,
} from "../../utilities/callingUtils";
import { tableservice } from "../../utilities/TableFunctions";
import { refreshACSToken } from "../../utilities/utils";

async function userlogin(username) {
    // const loginInput = document.querySelector("#Login-input");
    tableservice.retrieveEntity(
        "KioskToken",
        username,
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

class KioskView extends React.Component {
    componentDidMount() {
        //username of the kiosk to login to
        const username = "Kiosk1";
        userlogin(username);
    }

    render() {
        return (
            <React.Fragment>
                <div id="kioskVideo" className="videoParent ">
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

export default KioskView;
