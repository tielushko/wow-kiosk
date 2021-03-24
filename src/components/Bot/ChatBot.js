import React, { useState } from "react";
import './ChatBot.css'

const iframeStyle = {
    minWidth: "400px",
    width: "100%",
    minHeight: "500px",
};
const ChatBot = () => {
    return (
        <iframe
            className='iframeStyle'
            title="WoW-kiosk ChatBot"
            src="https://webchat.botframework.com/embed/wow-kiosk-bot?s=myHM7vekhIQ._aT9Gv4LHsNPVP6RCnsyLy1qB-wVnjFywJtJzvBQ4GA"
            //style={iframeStyle}
        ></iframe>
    );
};

export default ChatBot;


