import React from "react";
import Chat from "../../components/Chat/Chat";
import ChatBot from "../../components/Bot/ChatBot";
import KioskView from "../../components/CallFields/KioskView.js";
import QRCodeForHandoff from "../../components/CallFields/QRCodeForHandoff"

import "./Home.css";


{/* <div className="column-right border">
    <Chat />
</div> */}

const Home = () => {
   
    //column-left
    //column-right
    //row

    return (
        <div className="home-container">
            <div className='row ghost' id='homeKiosk'> 
                <div className='border videoContainer'>
                    <div className="qr-location">
                    <QRCodeForHandoff />
                    </div>
                    <div className='homeVideo-location'>
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
