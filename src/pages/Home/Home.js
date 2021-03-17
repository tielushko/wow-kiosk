import React from "react";
import UserFetchField from "../../components/UserFetchField";
import ChatBot from "../../components/ChatBot";
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
                    <ChatBot />
                    {/* <img className="img-hold" src="logo512.png" alt="holder" /> */}
                </div>
                <div className="row border-top">
                    <img className="img-hold" src="logo512.png" alt="holder" />
                </div>
            </div>
        </div>
    );
};

export default Home;
