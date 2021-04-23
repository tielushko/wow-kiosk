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
