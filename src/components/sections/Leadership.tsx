import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import marcoLeonePhoto from "@/assets/marco-leone.jpeg";

const Leadership = () => {
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
    <section id="lideranca" className="py-24 lg:py-32 bg-secondary/30 relative">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden w-1/2">
              <img 
                src={marcoLeonePhoto} 
                alt="Marco Leone - Founder & Strategic Advisor" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              {t("leadership.label")}
            </span>
            <h2 className="heading-section text-foreground mb-4">
              {t("leadership.name")}
            </h2>
            <p className="text-xl text-primary font-heading mb-6">
              {t("leadership.role")}
            </p>

            <div className="space-y-4 text-body text-muted-foreground mb-8">
              <p>{t("leadership.bio1")}</p>
              <p>{t("leadership.bio2")}</p>
            </div>

            {/* Expertise Areas */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
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
