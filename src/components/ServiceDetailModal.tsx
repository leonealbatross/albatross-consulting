import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceDetailModalProps {
  trigger: React.ReactNode;
  title: string;
  content: string;
}

const parseServiceContent = (content: string) => {
  const lines = content.split("\n");
  const sections: { type: "title" | "subtitle" | "text" | "bullet" | "divider"; text: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^━+$/.test(trimmed)) continue; // skip divider lines
    if (/^(🎯|✅|📋|🔧)\s/.test(trimmed)) {
      sections.push({ type: "subtitle", text: trimmed });
    } else if (/^•\s/.test(trimmed)) {
      sections.push({ type: "bullet", text: trimmed.replace(/^•\s*/, "") });
    } else if (sections.length === 0 && !trimmed.startsWith("•")) {
      // First non-empty lines are title/intro
      if (sections.length === 0 && /^[A-ZÀ-Ú\s&]+$/.test(trimmed)) {
        continue; // skip the all-caps title (already shown in DialogTitle)
      }
      sections.push({ type: "text", text: trimmed });
    } else {
      sections.push({ type: "text", text: trimmed });
    }
  }
  return sections;
};

const ServiceDetailModal = ({ trigger, title, content }: ServiceDetailModalProps) => {
  const { t } = useLanguage();
  const sections = parseServiceContent(content);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg sm:text-xl font-heading text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 max-h-[60vh]">
          <div className="space-y-1">
            {sections.map((section, i) => {
              if (section.type === "subtitle") {
                return (
                  <h3 key={i} className="text-sm font-semibold text-primary pt-4 pb-1 uppercase tracking-wide">
                    {section.text}
                  </h3>
                );
              }
              if (section.type === "bullet") {
                return (
                  <div key={i} className="flex items-start gap-2 py-0.5">
                    <span className="text-primary mt-1.5 text-[6px]">●</span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{section.text}</span>
                  </div>
                );
              }
              return (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed py-1">
                  {section.text}
                </p>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <ContactModal 
              sectionTitle={`Serviço: ${title}`}
              trigger={
                <Button className="w-full group">
                  {t("cta.primary")}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              }
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
