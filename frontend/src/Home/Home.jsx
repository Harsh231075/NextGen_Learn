import React from 'react';
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import Footer from './Footer'
import Navbar from '../components/Navbar'
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  )
}

export default Home