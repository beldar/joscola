import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

export function Card({
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "bg-white rounded-2xl shadow-xl p-6 border-4",
        interactive && "cursor-pointer hover:shadow-2xl transition-shadow",
        className
      )}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
