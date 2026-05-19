import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
