import React, { useState, useEffect } from 'react';
import { headerLogo } from '../assets/images';
import { hamburger } from '../assets/icons';
import { navLinks } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // Check initial login status
    checkLoginStatus();

    // Create a custom event listener for login status changes
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    // Cleanup
    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  // Add event listener for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setShowConfirmation(false);
    // Dispatch custom event
    window.dispatchEvent(new Event('loginStatusChanged'));
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
            <li key={item.label}>
              <a href={item.href} className="font-montserrat leading-normal text-lg text-slate-gray hover:text-[#de7f45]">
                {item.label}
              </a>
            </li>
          ))}
          <li>
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

        <div className="lg:hidden flex items-center ml-[2rem]">
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
                  <li className="py-2">
                    <a href={item.href} className="font-montserrat text-lg text-slate-gray hover:text-[#de7f45]">
                      {item.label}
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