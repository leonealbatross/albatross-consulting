import { forwardRef } from "react";
import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import marcoLeonePhoto from "@/assets/marco-leone.jpeg";

const Leadership = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  const tags = [
    t("leadership.tag1"),
    t("leadership.tag2"),
    t("leadership.tag3"),
    t("leadership.tag4"),
    t("leadership.tag5"),
    t("leadership.tag6"),
  ];

  return (
    <section ref={ref} id="lideranca" className="py-16 lg:py-24 xl:py-32 bg-secondary/30 relative">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Image */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden w-3/4 sm:w-1/2">
              <img 
                src={marcoLeonePhoto} 
                alt="Marco Leone - Founder & Strategic Advisor" 
                className="w-full h-full object-cover object-[center_20%]"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-primary font-semibold text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
              {t("leadership.label")}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
              {t("leadership.name")}
            </h2>
            <p className="text-lg sm:text-xl text-primary font-heading mb-4 sm:mb-6">
              {t("leadership.role")}
            </p>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8">
              <p>{t("leadership.bio1")}</p>
              <p>{t("leadership.bio2")}</p>
            </div>

            {/* Expertise Areas */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6 sm:mb-8">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-secondary rounded-full text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start gap-4">
              <a 
                href="https://www.linkedin.com/in/marcoleone/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 sm:w-11 sm:h-11">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </a>
              <a href="mailto:marco@albatross.consulting">
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 sm:w-11 sm:h-11">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Leadership.displayName = "Leadership";

export default Leadership;
