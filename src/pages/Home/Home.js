import React, { useEffect, useRef } from "react";
import Chat from "../../components/Chat/Chat";
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
                    <Chat />
                </div>
            </div>
        </div>
    );
};

export default Home;
