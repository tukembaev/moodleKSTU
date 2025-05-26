import { motion } from "framer-motion";
import React, { ReactNode } from "react";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
};

type MotionListProps = {
  children: ReactNode[] | ReactNode;
  className?: string;
};
export const HoverScale = ({ children, className }: MotionWrapperProps) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={`cursor-pointer ${className}`}
  >
    {children}
  </motion.div>
);

export const HoverLift = ({ children, className }: MotionWrapperProps) => (
  <motion.div
    whileHover={{ scale: 1, y: -5 }}
    className={`cursor-pointer ${className}`}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({ children, className }: MotionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 1 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeOut = ({ children, className }: MotionWrapperProps) => (
  <motion.div
    exit={{ opacity: 0, scale: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SpringPopup = ({ children, className }: MotionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.1,
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInList = ({ children, className }: MotionListProps) => (
  <>
    {React.Children.toArray(children).map((child, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={className}
        style={{ display: "contents" }}
      >
        {child}
      </motion.div>
    ))}
  </>
);

export const SpringPopupList = ({ children, className }: MotionListProps) => (
  <>
    {React.Children.toArray(children).map((child, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: index * 0.05,
        }}
        className={className}
      >
        {child}
      </motion.div>
    ))}
  </>
);
