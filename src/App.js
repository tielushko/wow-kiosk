import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Header from "./components/Header";
import UserFetchField from "./components/UserFetchField";

import Manatee from "./components/RouteTest/Manatee/Manatee";
import Narwhal from "./components/RouteTest/Narwhal/Narwhal";
import Whale from "./components/RouteTest/Whale/Whale";

function App() {
    return (
        <div>
            <Header />
            <nav>
                <ul>
                    <li>
                        <a href="/manatee">Manatee</a>
                    </li>
                    <li>
                        <a href="/narwhal">Narwhal</a>
                    </li>
                    <li>
                        <a href="/whale">Whale</a>
                    </li>
                </ul>
            </nav>
            <BrowserRouter>
                <Switch>
                    <Route path="/whale">
                        <Whale />
                    </Route>
                    <Route path="/manatee">
                        <Manatee />
                    </Route>
                    <Route path="/narwhal">
                        <Narwhal />
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
