import React from "react";
import "./Header.css";

// render of the USF logo
const Header = () => {
    return (
        <div className="header">
            <img className="usfImg" src="USF-logo.png" alt="USF" />
        </div>
    );
};

export default Header;
