import { HomeTemplate } from "../components/templates";
import {
  HeroSection, BannerCarousel, RoutesSection, HowItWorks,
  ResourceTypes, ContextSection, SupportSection,
} from "../components/organisms";

export default function Home() {
  return (
    <HomeTemplate>
      <HeroSection />
      <BannerCarousel />
      <RoutesSection />
      <HowItWorks />
      <ResourceTypes />
      <ContextSection />
      <SupportSection />
    </HomeTemplate>
  );
}
