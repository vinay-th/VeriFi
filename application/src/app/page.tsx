import About from './components/About';
import HeroSection from './components/HeroSection';

export default function Home() {
  return (
    <div className="bg-BGBlue">
      <HeroSection />
      <About />
    </div>
  );
}
