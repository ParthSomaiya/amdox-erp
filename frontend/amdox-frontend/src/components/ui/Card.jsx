import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        glass-card
        rounded-3xl
        p-6
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}