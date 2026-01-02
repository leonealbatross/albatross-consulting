import { useEffect, useRef, useState } from "react";

export const useSectionHighlight = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return { sectionRef, isVisible };
};
