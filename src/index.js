import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

import App from "./components/App";
import Credit from "./components/Credit";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <App />
    <Credit />
  </StrictMode>
);
