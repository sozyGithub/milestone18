import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ScrollToTop from "./components/ScrollToTop";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";

function App() {
  const [ dropdownState, setDropdownState ] = useState(false);


  function handleDropdown(e) {
    e.stopPropagation()
    setDropdownState(!dropdownState)
}

  return (
    <div onClick={() => setDropdownState(false)}>
      <Navbar dropdownState={dropdownState} handleDropdown={handleDropdown}/>
      <ScrollToTop />
      <div className="sm:pt-[100px] pt-[68px] px-16">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/place-detail/:id" element={<PlaceDetailPage />} />
          <Route exact path="/signin" element={<SignInPage />} />
          <Route exact path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;