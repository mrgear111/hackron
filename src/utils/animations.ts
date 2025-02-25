export const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const slideIn = (direction: "left" | "right", delay: number = 0) => ({
  initial: {
    x: direction === "left" ? -100 : 100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut"
    }
  }
}); 