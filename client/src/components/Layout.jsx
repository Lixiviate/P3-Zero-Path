import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>  {/* Main page content */}
      <Footer />  {/* Footer will be at the bottom */}
    </div>
  );
};

export default Layout;
