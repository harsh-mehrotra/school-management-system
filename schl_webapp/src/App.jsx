import "./App.css";
import React, { useEffect } from "react";
import CustomRoutes from "./routes/Routes.jsx";

import axios from "axios";

function App() {
  useEffect(() => {}, []);
  // axios.defaults.withCredentials = true;
  return (
    <div className="w-full z-10 max-h-scren box-border overflow-auto">
      <div
        style={{
          height: "100%",
          maxHeight: "calc(100%-250px)",
          overflow: "hidden",
          boxSizing: "border-box",

          // position: "relative",
        }}
      >
        <CustomRoutes />
      </div>
    </div>
  );
}

export default App;
