import { motion } from "framer-motion";

const Caret = ({ blink, duration }) => {
  if (blink === undefined) {
    blink = true;
  }

  if (duration === undefined) {
    duration = 0.5;
  }

  if (blink) {
    return (
      <motion.div
        aria-hidden={true}
        className="inline-block w-0.5 h-7 bg-primary-500 translate-y-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: duration,
        }}
      />
    );
  } else {
    return (
      <div
        aria-hidden={true}
        className="inline-block w-0.5 h-7 bg-primary-500 translate-y-0.5"
      />
    );
  }
};

export default Caret;
