<<<<<<< Updated upstream
import React from "react";
=======
import React, { useEffect, useRef } from "react";
import Chat from "../../components/Chat/Chat";
import ChatBot from "../../components/Bot/ChatBot";
>>>>>>> Stashed changes
import UserFetchField from "../../components/UserFetchField";
import "./Home.css";

const Home = () => {
<<<<<<< Updated upstream
    return (
        <div className="container">
            
            <div className="column left border">
                <UserFetchField />
            </div>
            
            <div className="column right border">
                <div className="row border-bottom">
                    <img className="img-hold" src="logo512.png" alt="holder" />
                </div>
                <div className="row border-top">
                    <img className="img-hold" src="logo512.png" alt="holder" />
=======
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
>>>>>>> Stashed changes
                </div>
            </div>
            <div className="row border">
                <ChatBot />
            </div>
            
        </div>
    );
};

export default Home;
