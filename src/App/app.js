import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Users from "./layouts/users";
import Login from "./layouts/login";
import Main from "./layouts/main";
import NavBar from "./components/navBar";

export default function App() {
    return <div>
        <NavBar />
        <Switch>
            <Route path="/users/:userId?" component={Users} />
            <Route path="/login" component={Login} />
            <Route path="/" exact component={Main} />
            <Redirect to="/" />
        </Switch>
    </div>;
}
