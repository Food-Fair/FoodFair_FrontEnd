import React, { useState, useEffect } from 'react';
import { headerLogo } from '../assets/images';
import { hamburger } from '../assets/icons';
import { navLinks } from '../assets/constants';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasCartItems, setHasCartItems] = useState(false);
  
  const navigate = useNavigate();

  const enhancedNavLinks = [
    ...navLinks,
    ...(isLoggedIn ? [{ label: 'Notifications', component: Notifications }] : [])
  ];

  // Combined useEffect for login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };

    // Check initial login status
    checkLoginStatus();

    // Add event listeners
    window.addEventListener('loginStatusChanged', checkLoginStatus);
    window.addEventListener('storage', (e) => {
      if (e.key === 'access_token') {
        checkLoginStatus();
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []); // Empty dependency array

// Separate useEffect for cart status
useEffect(() => {
  const checkCart = () => {
    try {
      const cart = localStorage.getItem('cart');
      if (!cart) {
        setHasCartItems(false);
        return;
      }

      const parsedCart = JSON.parse(cart);
      const hasItems = parsedCart && Object.keys(parsedCart).length > 0;
      setHasCartItems(hasItems);
    } catch (error) {
      console.error('Error checking cart:', error);
      setHasCartItems(false);
    }
  };

  // Check initially
  checkCart();

  // Add event listener for cart changes
  const handleCartUpdate = () => {
    checkCart();
  };

  window.addEventListener('cartUpdated', handleCartUpdate);

  return () => {
    window.removeEventListener('cartUpdated', handleCartUpdate);
  };
}, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    // First handle logout
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setShowConfirmation(false);
    window.dispatchEvent(new Event('loginStatusChanged'));
  
    // Then handle cart cleanup
    setHasCartItems(false); // Directly update the state
    localStorage.removeItem('cart');
    
    // Use setTimeout to ensure events are dispatched in order
    setTimeout(() => {
      window.dispatchEvent(new Event('cartUpdated'));
    }, 0);
  
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <header className="top-0 z-[2000] w-full mx-auto bg-white h-[5rem] flex items-center shadow-[0_0_40px_rgba(0,0,0,0.2)]">
      <nav className="flex w-4/5 justify-between items-center max-container relative">
        <a href="/">
          <img
            src='ff.svg'
            alt="logo"
            width={50}
            height={50}
            className="flex-shrink-0"
          />
        </a>

        <ul className="hidden lg:flex flex-1 justify-end items-center gap-16 mr-[2]">
  {navLinks.map((item) => (
    <li key={item.label} className="flex items-center">
      <a 
        href={item.href} 
        className="font-montserrat leading-normal text-lg text-slate-gray hover:text-[#de7f45] relative"
      >
        {item.label}
        {item.id === 'cart' && hasCartItems && (
          <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </a>
    </li>
  ))}
  {/* Separate Notifications item */}
  {isLoggedIn && (
    <li className="flex items-center">
      <Notifications />
    </li>
  )}
  {/* Login/Logout item */}
  <li className="flex items-center">
    {isLoggedIn ? (
      <button 
        onClick={handleLogout}
        className="font-montserrat leading-normal text-lg text-slate-gray hover:text-[#de7f45]"
      >
        Logout
      </button>
    ) : (
      <a 
        href="/login"
        className="font-montserrat leading-normal text-lg text-slate-gray hover:text-[#de7f45]"
      >
        Login
      </a>
    )}
  </li>
</ul>
        {/* Hamburger Menu for smaller screens */}
<div className="lg:hidden flex items-center gap-4 ml-[2rem]">
  {/* Mobile Notification Icon */}
  {isLoggedIn && (
    <div className="flex items-center">
      <Notifications />
    </div>
  )}
  
  <img
    src={hamburger}
    alt="Hamburger"
    width={25}
    height={25}
    onClick={toggleMenu}
    className="cursor-pointer"
  />
</div>

        {isOpen && (
          <div className="absolute top-[5.7rem] z-20 right-0 w-[40%] bg-white lg:hidden shadow-lg rounded-lg border border-gray-300">
            <ul className="flex flex-col items-center p-4">
            {navLinks.map((item) => (
                <div key={item.label}>
                  <li className="py-2 relative">
                    <a 
                      href={item.href} 
                      className="font-montserrat text-lg text-slate-gray hover:text-[#de7f45] relative"
                    >
                      {item.label}
                      {item.id === 'cart' && hasCartItems && (
                        <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </a>
                  </li>
                  <hr className="my-4 h-[2px] bg-[#e3dddd] border-0" />
                </div>
              ))}
              <div>
                <li className="py-2">
                  {isLoggedIn ? (
                    <button 
                      onClick={handleLogout}
                      className="font-montserrat text-lg text-slate-gray hover:text-[#de7f45]"
                    >
                      Logout
                    </button>
                  ) : (
                    <a 
                      href="/login"
                      className="font-montserrat text-lg text-slate-gray hover:text-[#de7f45]"
                    >
                      Login
                    </a>
                  )}
                </li>
                <hr className="my-4 h-[2px] bg-[#e3dddd] border-0" />
              </div>
            </ul>
          </div>
        )}
      </nav>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000]">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-[#de7f45] text-white rounded hover:bg-[#c26835] transition-colors"
              >
                Yes
              </button>
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;