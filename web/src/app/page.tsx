'use client'
import NavigationHome from './components/NavigationHome';
import HeroHome from './components/HeroHome';
import CategoriesHome from './components/CategoriesHome';
import TabsHome from './components/TabsHome';
import CTAHome from './components/CTAHome';
import FooterHome from './components/FooterHome';

export default function FreelancePlatform() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <NavigationHome />
      {/* Hero Section */}
      <HeroHome />
      {/* Categories */}
      <CategoriesHome />
      {/* Tabs */}
      <TabsHome />
      {/* CTA Section */}
      <CTAHome />
      {/* Footer */}
      <FooterHome />
    </div>
  );
}