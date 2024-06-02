import React from 'react';
import PublicButton from '../buttons/publicButton';


const HeroSection: React.FC<> = () => {
  return (
    <div className="relative w-full h-screen bg-white flex flex-col md:flex-row pt-24 md:pt-32">
      <div className="relative z-10 flex flex-col items-center justify-center w-full md:w-1/2 h-full p-6">
        <h1 className="text-4xl md:text-6xl text-sky-500 font-bold mb-4">Empower Truth:</h1>
        <p className="text-lg md:text-xl text-black mb-8">Your Voice, Our Platform!</p>
        <a href='/signup'>
          <PublicButton action={() => {}} text="SIGN-UP NOW!" />
        </a>
      </div>
      <div className="relative w-full md:w-1/2 h-full">
        <img
          src="./HeroImmage03.png"
          alt="Hero Background"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default HeroSection;
