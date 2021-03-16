import React, { useEffect, useRef } from "react";
import Chat from "../../components/Chat/Chat";
import ChatBot from "../../components/Bot/ChatBot";
import UserFetchField from "../../components/UserFetchField";
import "./Home.css";

const Home = () => {
    // const videoRef = useRef(null);

    // useEffect(() => {
    //   getVideo();
    // }, [videoRef]);

    // const getVideo = () => {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: { width: 300 } })
    //     .then((stream) => {
    //       let video = videoRef.current;
    //       video.srcObject = stream;
    //       video.play();
    //     })
    //     .catch((err) => {
    //       console.error("error:", err);
    //     });
    // };

    //column-left
    //column-right
    //row

    return (
        <div className="container">
            <div className='row'> 
                <div className='column-left border videoContainer'>
                    <UserFetchField />
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
