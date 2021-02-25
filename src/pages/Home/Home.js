import React from "react";
import UserFetchField from "../../components/UserFetchField";
import "./Home.css";

const Home = () => {
    return (
        <div className="container">
            <div className="column left border">
                <div className="row border-bottom">
                    <img className="img-hold" src="logo512.png" alt="holder" />
                </div>
                <div className="row border-top">
                    <img className="img-hold" src="logo512.png" alt="holder" />
                </div>
            </div>
            <div className="column right border"></div>
            <UserFetchField />
        </div>
    );
};

export default Home;
