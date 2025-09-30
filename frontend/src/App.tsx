import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import ChatSection from "./components/ChatSection";
import { Footer } from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import Toaster from "./components/ui/sonner";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
};

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
