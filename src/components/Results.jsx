import React from "react";
import { motion } from "framer-motion";

import { formatPercentage } from "../utils/helpers";

const Results = ({ accuracy, errors, total, className }) => {
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };
  const duration = { duration: 0.5 };

  return (
    <motion.ul
      className={`flex flex-col items-center text-primary-400 space-y-3 ${className}`}
    >
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0 }}
        className="text-xl font-semibold"
      >
        Results
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0.1 }}
      >
        Accuracy: {formatPercentage(accuracy)}
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0.2 }}
        className="text-error-500"
      >
        Errors: {errors}
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0.3 }}
      >
        Words: {total}
      </motion.li>
    </motion.ul>
  );
};

export default Results;
