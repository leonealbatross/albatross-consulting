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

interface ServiceDetailModalProps {
  trigger: React.ReactNode;
  title: string;
  content: string;
}

const ServiceDetailModal = ({ trigger, title, content }: ServiceDetailModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {content}
          </p>
          <div className="mt-6 pt-4 border-t border-border">
            <ContactModal 
              trigger={
                <Button className="w-full group">
                  {t("cta.primary")}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
