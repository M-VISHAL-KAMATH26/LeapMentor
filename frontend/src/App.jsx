// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import RegisterMentee from "./pages/RegisterMentee";
import RegisterMentor from "./pages/RegisterMentor";
import RegisterBoth from "./pages/RegisterBoth";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home (you already have it in components) */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/register/mentee" element={<RegisterMentee />} />
        <Route path="/register/mentor" element={<RegisterMentor />} />
        <Route path="/register/both" element={<RegisterBoth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
