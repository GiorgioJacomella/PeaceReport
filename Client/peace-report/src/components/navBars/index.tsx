import React, { useState } from 'react';
import PublicButton from '../buttons';

type NavbarProps = {};

const PublicNav: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-xl z-50">
      <div className="flex items-center justify-between p-4">
        <a href='..'><img src="./logo.png" alt='Logo' style={{ height: '5rem' }} /></a>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
        <ul className={`flex-col md:flex-row md:flex md:items-center ${isOpen ? 'block' : 'hidden'} gap-4`}>
          <li className="font-bold bg-sky-100 text-sky-500 text-lg rounded hover:shadow-xl mb-4 md:mb-0">
            <a href="/" className="block py-2 px-4">Home</a>
          </li>
          <li className="font-bold bg-sky-100 text-sky-500 text-lg rounded hover:shadow-xl mb-4 md:mb-0">
            <a href="/#Mission" className="block py-2 px-4">Mission</a>
          </li>
          <li className="font-bold bg-sky-100 text-sky-500 text-lg rounded hover:shadow-xl mb-4 md:mb-0">
            <a href="/#Roadmap" className="block py-2 px-4">Roadmap</a>
          </li>
          <li className="mb-4 md:mb-0">
            <a href="/signup">
              <PublicButton action={() => {}} text="Sign-up" />
            </a>
          </li>
          <li className="font-bold text-sky-500 text-lg rounded border border-sky-500 hover:shadow-xl mb-4 md:mb-0">
            <a href="/login" className="block py-2 px-4">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default PublicNav;