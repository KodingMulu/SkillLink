'use client'
import NavigationHome from './components/NavigationHome';
import HeroHome from './components/HeroHome';
import CategoriesHome from './components/TrustedBy';
import TabsHome from './components/Features';
import CTAHome from './components/CTAHome';
import FooterHome from './components/FooterHome';

export default function FreelancePlatform() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHome />
      <HeroHome />
      <CategoriesHome />
      <TabsHome />
      <CTAHome />
      <FooterHome />
    </div>
  );
}