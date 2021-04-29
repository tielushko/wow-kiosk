import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Header from "./components/Header";
import GroupCallHandoff from "./components/CallFields/GroupCallHandoff";
import VolunteerView from "./components/CallFields/VolunteerView";

function App() {
    return (
        <div>
            <Header />
            {/* router setup for the website to handle various request and render appropriate page for server request */}
            <BrowserRouter>
                <Switch>
                    <Route path="/handoff">
                        <GroupCallHandoff />
                    </Route>
                    <Route path="/kiosk">
                        <Home />
                    </Route>
                    <Route path="/volunteer">
                        <VolunteerView />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
