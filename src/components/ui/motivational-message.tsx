import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Rocket, Target, Trophy, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MotivationalMessageProps {
  step: number;
  totalSteps: number;
  fieldsCompleted: number;
  totalFields: number;
  language: "PT" | "EN" | "ES";
}

const messages = {
  PT: {
    start: [
      { text: "Vamos começar! Preencha seus dados básicos.", icon: Rocket },
      { text: "Cada campo preenchido te aproxima de uma análise personalizada.", icon: Target },
    ],
    step1Progress: [
      { text: "Ótimo progresso! Continue assim.", icon: Sparkles },
      { text: "Você está indo muito bem!", icon: Zap },
      { text: "Quase lá no primeiro passo!", icon: Heart },
    ],
    step1Complete: [
      { text: "Excelente! Primeira etapa concluída. Vamos para a análise detalhada.", icon: Trophy },
    ],
    step2Start: [
      { text: "Agora vamos entender melhor sua transação.", icon: Target },
      { text: "Esta etapa define o escopo da análise.", icon: Sparkles },
    ],
    step2Progress: [
      { text: "Informações valiosas! Continue preenchendo.", icon: Zap },
      { text: "Cada detalhe nos ajuda a entregar mais valor.", icon: Heart },
      { text: "Você está quase finalizando!", icon: Rocket },
    ],
    step2Almost: [
      { text: "Falta muito pouco! Você consegue!", icon: Trophy },
      { text: "A linha de chegada está próxima!", icon: Target },
    ],
    step2Complete: [
      { text: "Pronto! Revise e envie sua solicitação.", icon: Trophy },
    ],
  },
  EN: {
    start: [
      { text: "Let's start! Fill in your basic information.", icon: Rocket },
      { text: "Each field brings you closer to a personalized analysis.", icon: Target },
    ],
    step1Progress: [
      { text: "Great progress! Keep going.", icon: Sparkles },
      { text: "You're doing great!", icon: Zap },
      { text: "Almost there on the first step!", icon: Heart },
    ],
    step1Complete: [
      { text: "Excellent! First step done. Let's move to detailed analysis.", icon: Trophy },
    ],
    step2Start: [
      { text: "Now let's understand your transaction better.", icon: Target },
      { text: "This step defines the scope of the analysis.", icon: Sparkles },
    ],
    step2Progress: [
      { text: "Valuable information! Keep filling in.", icon: Zap },
      { text: "Each detail helps us deliver more value.", icon: Heart },
      { text: "You're almost done!", icon: Rocket },
    ],
    step2Almost: [
      { text: "Just a little more! You've got this!", icon: Trophy },
      { text: "The finish line is near!", icon: Target },
    ],
    step2Complete: [
      { text: "Ready! Review and submit your request.", icon: Trophy },
    ],
  },
  ES: {
    start: [
      { text: "¡Comencemos! Complete sus datos básicos.", icon: Rocket },
      { text: "Cada campo lo acerca a un análisis personalizado.", icon: Target },
    ],
    step1Progress: [
      { text: "¡Gran progreso! Sigue así.", icon: Sparkles },
      { text: "¡Lo estás haciendo muy bien!", icon: Zap },
      { text: "¡Casi llegas al primer paso!", icon: Heart },
    ],
    step1Complete: [
      { text: "¡Excelente! Primera etapa completada. Vamos al análisis detallado.", icon: Trophy },
    ],
    step2Start: [
      { text: "Ahora entendamos mejor su transacción.", icon: Target },
      { text: "Esta etapa define el alcance del análisis.", icon: Sparkles },
    ],
    step2Progress: [
      { text: "¡Información valiosa! Continúa llenando.", icon: Zap },
      { text: "Cada detalle nos ayuda a entregar más valor.", icon: Heart },
      { text: "¡Casi terminas!", icon: Rocket },
    ],
    step2Almost: [
      { text: "¡Falta muy poco! ¡Tú puedes!", icon: Trophy },
      { text: "¡La meta está cerca!", icon: Target },
    ],
    step2Complete: [
      { text: "¡Listo! Revisa y envía tu solicitud.", icon: Trophy },
    ],
  },
};

const MotivationalMessage = ({
  step,
  totalSteps,
  fieldsCompleted,
  totalFields,
  language,
}: MotivationalMessageProps) => {
  const progressPercentage = (fieldsCompleted / totalFields) * 100;
  const langMessages = messages[language] || messages.PT;

  const getMessage = () => {
    if (step === 1) {
      if (fieldsCompleted === 0) {
        return langMessages.start[Math.floor(Math.random() * langMessages.start.length)];
      } else if (progressPercentage < 80) {
        const index = Math.min(
          Math.floor(progressPercentage / 30),
          langMessages.step1Progress.length - 1
        );
        return langMessages.step1Progress[index];
      } else {
        return langMessages.step1Complete[0];
      }
    } else {
      if (fieldsCompleted === 0) {
        return langMessages.step2Start[Math.floor(Math.random() * langMessages.step2Start.length)];
      } else if (progressPercentage < 50) {
        return langMessages.step2Progress[0];
      } else if (progressPercentage < 80) {
        return langMessages.step2Progress[Math.min(1, langMessages.step2Progress.length - 1)];
      } else if (progressPercentage < 100) {
        return langMessages.step2Almost[0];
      } else {
        return langMessages.step2Complete[0];
      }
    }
  };

  const message = getMessage();
  const Icon = message.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${step}-${Math.floor(progressPercentage / 20)}`}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border transition-colors duration-300",
          progressPercentage >= 80
            ? "bg-primary/10 border-primary/30 text-primary"
            : progressPercentage >= 50
            ? "bg-accent/10 border-accent/30 text-accent"
            : "bg-muted/50 border-border text-muted-foreground"
        )}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: progressPercentage >= 80 ? [0, 10, -10, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: progressPercentage >= 80 ? Infinity : 0,
            repeatDelay: 2,
          }}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
        </motion.div>
        <span className="text-sm font-medium">{message.text}</span>
        
        {/* Progress dots */}
        <div className="ml-auto flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                i < step
                  ? "bg-primary"
                  : i === step - 1
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
              )}
              animate={{
                scale: i === step - 1 ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: i === step - 1 ? Infinity : 0,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export { MotivationalMessage };
