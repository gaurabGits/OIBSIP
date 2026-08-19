import HeroSection from '../../component/Landing Page/HeroSection';
import FeatureSection from '../../component/Landing Page/FeatureSection';
import MenuSection from '../../component/Landing Page/MenuSection';
import { Star} from 'lucide-react';



function LandingPage() {
  return (
        <div className="bg-white font-sans antialiased">
          {/* HERO  */}
          <HeroSection />

          {/* FEATURES  */}
          <FeatureSection />

          {/* MENU */}
          <MenuSection />
        </div>
    );
}

export default LandingPage;