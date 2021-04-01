import React from "react";
import Chat from "../../components/Chat/Chat";
import ChatBot from "../../components/Bot/ChatBot";
import KioskView from "../../components/CallFields/KioskView.js";

import "./Home.css";

const Home = () => {
   
    //column-left
    //column-right
    //row

    return (
        <div className="container">
            <div className='row'> 
                <div className='column-left border videoContainer'>
                    <KioskView />
                </div>
                <div className="column-right border">
                    <Chat />
                </div>
            </div>
            <div className="row border">
                <ChatBot />
            </div>
            
        </div>
    );
};

export default Home;
