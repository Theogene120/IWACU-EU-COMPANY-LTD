import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloating from './WhatsAppFloating';
import GoToTop from './GoToTop';

const UserLayout = () => (
  <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFloating />
    <GoToTop />
  </div>
);

export default UserLayout;
