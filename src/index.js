import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store";
import Main from "./Context/Main";
import ErrorBoundary from "./Components/ErrorBoundary";
window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = { shouldCatchError: () => false };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <Main>
        <App />
      </Main>
    </Provider>
  </ErrorBoundary>
);

reportWebVitals();
