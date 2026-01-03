import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AnimatedSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
  isValid?: boolean;
  showValidIcon?: boolean;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

const shakeAnimation = {
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.5 }
  }
};

const AnimatedSelect = ({
  value,
  onValueChange,
  placeholder,
  options,
  hasError,
  isValid,
  showValidIcon = true,
  className,
  contentClassName,
  disabled,
}: AnimatedSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [shouldShake, setShouldShake] = React.useState(false);
  const prevHasError = React.useRef(hasError);

  // Trigger shake when error appears
  React.useEffect(() => {
    if (hasError && !prevHasError.current) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
    prevHasError.current = hasError;
  }, [hasError]);

  const showCheck = showValidIcon && isValid && !hasError && !isOpen && value;

  return (
    <div className="relative">
      <motion.div
        animate={shouldShake ? "shake" : undefined}
        variants={shakeAnimation}
      >
        <Select
          value={value}
          onValueChange={onValueChange}
          onOpenChange={setIsOpen}
          disabled={disabled}
        >
          <motion.div
            animate={{
              scale: isOpen ? 1.01 : 1,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <SelectTrigger
              className={cn(
                "transition-all duration-200",
                hasError && "border-destructive ring-destructive/20",
                isOpen && !hasError && "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]",
                isValid && !hasError && !isOpen && "border-green-500/50",
                showCheck && "pr-10",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </motion.div>
          <SelectContent className={cn("bg-background border shadow-lg z-50", contentClassName)}>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
      
      {/* Animated checkmark */}
      <AnimatePresence>
        {showCheck && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AnimatedSelect };
