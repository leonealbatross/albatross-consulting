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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Clients />
        <Methodology />
        <Leadership />
        <Scheduling calendlyUrl="https://calendly.com/albatross-consulting" />
        <Careers hubspotPortalId="YOUR_PORTAL_ID" hubspotFormId="YOUR_FORM_ID" />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
