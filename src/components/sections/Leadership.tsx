import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Leadership = () => {
  return (
    <section id="lideranca" className="py-24 lg:py-32 bg-secondary/30 relative">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-card to-secondary border border-border overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-6xl font-heading font-bold text-primary/30">ML</span>
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Liderança
            </span>
            <h2 className="heading-section text-foreground mb-4">
              Marco Leone
            </h2>
            <p className="text-xl text-primary font-heading mb-6">
              Founder & Strategic Advisor
            </p>

            <div className="space-y-4 text-body text-muted-foreground mb-8">
              <p>
                Executivo com mais de 25 anos de experiência em tecnologia, 
                transformação digital, estratégia de crescimento, governança e M&A.
              </p>
              <p>
                Atuação direta com CEOs, lideranças comerciais, investidores e conselhos, 
                conectando estratégia, execução e tecnologia para geração de valor sustentável.
              </p>
            </div>

            {/* Expertise Areas */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "Estratégia de Crescimento",
                "M&A",
                "Governança",
                "Transformação Digital",
                "Go-to-Market",
                "Liderança Executiva",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-secondary rounded-full text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
