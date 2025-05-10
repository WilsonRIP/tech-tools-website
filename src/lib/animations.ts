export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5, ease: 'easeInOut' },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5, ease: 'easeInOut' },
};

export const staggerContainer = (staggerChildren?: number, delayChildren?: number) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});

export const cardHoverEffect = {
  scale: 1.03,
  boxShadow: "0px 10px 20px rgba(0,0,0,0.1)", // Example shadow, adjust as needed
  transition: { duration: 0.3, ease: "circOut" },
};

export const subtleButtonHover = {
  scale: 1.05,
  transition: { duration: 0.2, ease: "circOut" },
};

// You can add more specific variants as needed, for example:
// export const slideInFromLeft = { ... };
// export const popUp = { ... }; 