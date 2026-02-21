// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import RegisterMentee from "./pages/RegisterMentee";
import RegisterMentor from "./pages/RegisterMentor";
import RegisterBoth from "./pages/RegisterBoth";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import MentorDashboard from "./pages/MentorDashboard";
import MenteeDashboard from "./pages/MenteeDashboard";
import MentorOnboarding from "./pages/MentorOnboarding";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/register/mentee" element={<RegisterMentee />} />
        <Route path="/register/mentor" element={<RegisterMentor />} />
        <Route path="/register/both" element={<RegisterBoth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Onboarding */}
        <Route path="/onboarding/mentor" element={<MentorOnboarding />} />

        {/* Dashboards */}
        <Route path="/dashboard/mentor" element={<MentorDashboard />} />
        <Route path="/dashboard/mentee" element={<MenteeDashboard />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;