import { useEffect, useState } from "react";
import "./App.css";
import { RouteComp } from "./Routes/Routes.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";

import { useLocation } from "react-router-dom";
import { LayoutComp } from "./Components/StaticBars/Layout.js";

import { handleControls } from "./Config/sessionmanager.js";

function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  const Location = useLocation();
  useEffect(() => {
    if (Location.pathname === "/" ||Location.pathname === "/OTP" ) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [Location]);
 
  useEffect(()=>{handleControls()})
  console.log(Location.pathname === "/");
  return (
    <div    >
      {IsAuthenticated ? (
        <>
          <div className="container-fluid">
            <LayoutComp/>
          </div>
        </>
      ) : (
        <>
          <RouteComp />
        </>
      )}
      {/* <ToastContainer/> */}
    </div>
  );
}

export default App;
