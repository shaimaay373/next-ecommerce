import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoriesGrid from '@/components/CategoriesGrid';
import BannersSection from '@/components/BannersSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategoriesGrid />
      <BannersSection />
      <FeaturedProducts />
      <Footer />
    </>
  );
}