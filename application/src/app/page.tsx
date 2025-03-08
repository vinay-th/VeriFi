import About from './components/About';
import HeroSection from './components/HeroSection';
import Subscriptions from './components/Subscriptions';

export default function Home() {
  return (
    <div className="bg-BGBlue">
      <HeroSection />
      <About />
      <Subscriptions />
    </div>
  );
}
