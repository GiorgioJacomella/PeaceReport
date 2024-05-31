import React from 'react';
import PublicNav from '../components/navBars/index';
import HeroSection from '../components/heroSection';

const Home: React.FC = () => {
  return (
    <main>
      <PublicNav />
      <HeroSection />
    </main>
  );
}

export default Home;
