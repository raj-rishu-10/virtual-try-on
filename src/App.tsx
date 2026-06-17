import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import SoulSerumAR from "./components/foundationOverride";
import ComingSoon from "./components/ComingSoon";
import Lipsticks from "./components/Lipsticks";
import Jewellery from "./components/Jewellery";
import Blush from "./components/Blush";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lipsticks" element={<Lipsticks />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/foundation-shades" element={<SoulSerumAR />} />
          <Route path="/blush" element={<Blush />} />
          <Route path="/try-now" element={<ComingSoon />} />
          {/* Support the old serum-try-on route too */}
          <Route path="/serum-try-on" element={<SoulSerumAR />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
