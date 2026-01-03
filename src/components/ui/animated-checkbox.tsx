import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
  hasError?: boolean;
}

const AnimatedCheckbox = ({
  id,
  checked,
  onCheckedChange,
  label,
  hasError,
}: AnimatedCheckboxProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors duration-200",
        checked 
          ? "bg-primary/10 border-primary/40" 
          : "bg-background border-border hover:bg-muted/50 hover:border-muted-foreground/30",
        hasError && !checked && "border-destructive/50"
      )}
      onClick={onCheckedChange}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200",
          checked 
            ? "bg-primary border-primary" 
            : "border-muted-foreground/50 bg-background",
          isHovered && !checked && "border-primary/50"
        )}
        animate={{
          scale: checked ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 25,
                duration: 0.2 
              }}
            >
              <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.label
        htmlFor={id}
        className={cn(
          "text-sm leading-tight cursor-pointer select-none transition-colors duration-200",
          checked ? "text-foreground font-medium" : "text-muted-foreground"
        )}
        animate={{
          color: checked ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>

      {/* Selection indicator */}
      <AnimatePresence>
        {checked && (
          <motion.div
            className="ml-auto flex-shrink-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Progress indicator for form sections
interface FormProgressIndicatorProps {
  current: number;
  total: number;
  label: string;
}

const FormProgressIndicator = ({ current, total, label }: FormProgressIndicatorProps) => {
  const percentage = (current / total) * 100;
  
  return (
    <motion.div 
      className="flex items-center gap-2 text-xs text-muted-foreground"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span>{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <motion.span 
        className="font-medium text-foreground"
        key={current}
        initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
        animate={{ scale: 1, color: "hsl(var(--foreground))" }}
        transition={{ duration: 0.3 }}
      >
        {current}/{total}
      </motion.span>
    </motion.div>
  );
};

export { AnimatedCheckbox, FormProgressIndicator };
