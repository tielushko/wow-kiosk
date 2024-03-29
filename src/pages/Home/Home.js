import React from "react";
import ChatBot from "../../components/Bot/ChatBot";
import KioskView from "../../components/CallFields/KioskView.js";
import QRCodeForHandoff from "../../components/CallFields/QRCodeForHandoff";

import "./Home.css";

// render of the /kiosk page that has bot, and when volunteer is in call, the qr code for handoff 
// as well as the kiosk view
const Home = () => {
    return (
        <div className="home-container">
            <div className="row ghost" id="homeKiosk">
                <div className="border videoContainer">
                    <div className="qr-location">
                        <QRCodeForHandoff />
                        <p className="homeText">Scan for Mobile Handoff</p>
                    </div>
                    <div className="homeVideo-location">
                        <KioskView />
                    </div>
                </div>
            </div>
            <div className="row border">
                <ChatBot />
            </div>
        </div>
    );
};

export default Home;
