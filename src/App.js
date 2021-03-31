import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Header from "./components/Header";
// import UserFetchField from "./components/UserFetchField";
import GroupCallHandoff from "./components/CallFields/GroupCallHandoff";
import QRCodeForHandoff from "./components/CallFields/QRCodeForHandoff";
import VolunteerView from "./components/CallFields/VolunteerView";
// import KioskView from "./components/CallFields/KioskView.js";

function App() {
    return (
        <div>
            <Header />
            {/* <nav>
                <ul>
                    <li>
                        <a href="/handoff">Handoff</a>
                    </li>
                </ul>
            </nav> */}
            <BrowserRouter>
                <Switch>
                    <Route path="/handoff">
                        <GroupCallHandoff />
                    </Route>
                    <Route path="/kiosk">
                        <QRCodeForHandoff />
                        <Home />
                    </Route>
                    <Route path="/volunteer">
                        <QRCodeForHandoff />
                        <VolunteerView />
                    </Route>
                </Switch>
            </BrowserRouter>
            {/* <Route to="/" exact render={() => <Home />} />
            <Route
                to="/testing"
                exact
                render={() => {
                    <UserFetchField />;
                }}
            /> */}
        </div>
    );
}

export default App;
