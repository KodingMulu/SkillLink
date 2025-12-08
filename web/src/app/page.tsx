'use client'
import NavigationHome from './components/NavigationHome';
import HeroHome from './components/HeroHome';
import CategoriesHome from './components/TrustedBy';
import Features from './components/Features';
import CTAHome from './components/CTAHome';
import FooterHome from './components/FooterHome';
import HowItWorks from './components/HowItWorks';

export default function FreelancePlatform() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHome />
      <HeroHome />
      <CategoriesHome />
      <Features />
      <HowItWorks />
      <CTAHome />
      <FooterHome />
    </div>
  );
}