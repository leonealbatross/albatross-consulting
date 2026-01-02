import { useCallback } from "react";

export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    const header = document.querySelector('header');
    
    if (element && header) {
      const headerHeight = header.getBoundingClientRect().height + 10;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  }, [scrollToSection]);

  return { scrollToSection, handleClick };
};
