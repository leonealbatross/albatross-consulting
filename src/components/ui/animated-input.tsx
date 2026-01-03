import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends Omit<React.ComponentProps<"input">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  hasError?: boolean;
  isValid?: boolean;
  showValidIcon?: boolean;
}

const shakeAnimation = {
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.5 }
  }
};

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, hasError, isValid, showValidIcon = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
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

    const showCheck = showValidIcon && isValid && !hasError && !isFocused && props.value;

    return (
      <div className="relative">
        <motion.div
          animate={shouldShake ? "shake" : undefined}
          variants={shakeAnimation}
        >
          <motion.input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
              hasError && "border-destructive ring-destructive/20",
              isFocused && !hasError && "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]",
              isValid && !hasError && !isFocused && "border-green-500/50",
              showCheck && "pr-10",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e as React.FocusEvent<HTMLInputElement>);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e as React.FocusEvent<HTMLInputElement>);
            }}
            animate={{
              scale: isFocused ? 1.01 : 1,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            disabled={props.disabled}
            id={props.id}
          />
        </motion.div>
        
        {/* Animated checkmark */}
        <AnimatePresence>
          {showCheck && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
