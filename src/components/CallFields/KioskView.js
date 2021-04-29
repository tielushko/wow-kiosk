import React from "react";

import "../VideoChat.css";
import "./KioskView.css";
import { refreshUser } from "../../utilities/callingUtils";
import { tableservice } from "../../utilities/TableFunctions";
import { refreshACSToken } from "../../utilities/utils";

// function responsible for taking the username of the kisok quering database to retrieve acs user id, and with that, refresh user,
// and refreshing the volunteer's access token.
async function userlogin(username) {
    tableservice.retrieveEntity(
        "KioskToken",
        username,
        "1",
        async function (error, result, response) {
            if (!error) {
                const AcsUserID = result.Userid._;
                const userDetailResponse = await refreshACSToken(AcsUserID);
                console.log(userDetailResponse);
                //refresh access token
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

    //render of the kiosk view
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
