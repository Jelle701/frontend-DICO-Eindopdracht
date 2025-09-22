import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

// Dit component fungeert als de hoofd-layout voor alle pagina's die de navigatiebalk nodig hebben.
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {/* De <Outlet> is de plek waar React Router de actieve pagina-component zal weergeven */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
