import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App/app";
import { Router } from "react-router-dom";
import { createStore } from "./App/store/createStore";
import { Provider } from "react-redux";
import history from "./App/utils/history";

const store = createStore();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
