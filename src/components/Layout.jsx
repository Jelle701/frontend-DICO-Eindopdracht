/**
 * @file Layout.jsx
 * @description This component acts as a structural wrapper for pages that require a consistent layout, such as a standard
 * navigation bar. It uses the `<Outlet />` component from `react-router-dom` to render the active nested route (i.e., the actual page content).
 *
 * @component
 * @returns {JSX.Element} A layout wrapper containing the Navbar and a main content area for the child route.
 *
 * @functions
 * - `Layout()`: The main functional component. It renders the `<Navbar />` at the top of the page and then an `<Outlet />`.
 *   The `<Outlet />` is a placeholder where React Router will render the component corresponding to the matched child route.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {/* The Outlet renders the active, nested route (the actual page) */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
