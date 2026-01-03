import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Clients from "@/components/sections/Clients";
import Methodology from "@/components/sections/Methodology";
import Leadership from "@/components/sections/Leadership";
import Scheduling from "@/components/sections/Scheduling";
import Careers from "@/components/sections/Careers";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";
import AlbaChatbot from "@/components/AlbaChatbot";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard navigation - WCAG 2.4.1 */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
      >
        Pular para o conteúdo principal
      </a>
      
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Services />
        <Clients />
        <Methodology />
        <Leadership />
        <Scheduling calendlyUrl="https://calendly.com/leone-albatross" />
        <Careers />
        <CTA />
      </main>
      <Footer />
      <AlbaChatbot />
      
    </div>
  );
};

export default Index;
