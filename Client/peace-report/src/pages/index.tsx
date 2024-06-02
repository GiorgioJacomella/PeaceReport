import React from 'react';
import PublicNav from '../components/navBars/PublicNav';
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
