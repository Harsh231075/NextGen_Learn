import React from 'react';
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import Navbar from '../components/Navbar'
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
    </>
  )
}

export default Home