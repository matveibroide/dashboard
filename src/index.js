import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App/App";
import "./index.css";

import CircleWithSmallCircles from "./CircleWithSmallCircles";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
