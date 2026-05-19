import { motion, useReducedMotion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionRevealProps = ComponentPropsWithoutRef<typeof motion.div> & {
  children: ReactNode;
  delay?: number;
};

export function SectionReveal({ children, delay = 0, ...props }: SectionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
