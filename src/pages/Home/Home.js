import React from "react";
import Chat from "../../components/Chat/Chat";
import ChatBot from "../../components/Bot/ChatBot";
import KioskView from "../../components/CallFields/KioskView.js";

import "./Home.css";


{/* <div className="column-right border">
    <Chat />
</div> */}

const Home = () => {
   
    //column-left
    //column-right
    //row

    return (
        <div className="container">
            <div className='row'> 
                <div className='border videoContainer'>
                    <KioskView />
                </div>
                
            </div>
            <div className="row border">
                <ChatBot />
            </div>
            
        </div>
    );
};

export default Home;
