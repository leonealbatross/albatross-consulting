import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Methodology from "@/components/sections/Methodology";
import Leadership from "@/components/sections/Leadership";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Methodology />
        <Leadership />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
