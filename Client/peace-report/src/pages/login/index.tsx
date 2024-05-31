import React from 'react';
import PublicNav from '@/src/components/navBars';

const Login: React.FC = () => {
  return (
    <main>
        <PublicNav/>
        <div className="relative w-full h-screen bg-white flex flex-col md:flex-row pt-24">
            <div className="relative w-full md:w-1/2 h-full">
                <img
                src="./HeroImmage02.png"
                alt="Hero Background"
                className="h-full w-full object-cover"
                />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full md:w-1/2 h-full p-6">
                {//Form
                }
            </div>
        </div>
    </main>
  );
}

export default Login;
