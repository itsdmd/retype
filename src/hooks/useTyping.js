import { useCallback, useState, useRef, useEffect } from "react";

const isAllowedKeyCode = (code) => {
  return (
    code.startsWith("Key") ||
    code.startsWith("Digit") ||
    code === "Space" ||
    code === "Backspace"
  );
};

const useTyping = (enabled = true) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState("");
  const totalTyped = useRef(0);

  const keydownHandler = useCallback(
    ({ key, code }) => {
      if (!enabled) {
        console.log("not enabled");
        return;
      }
      if (!isAllowedKeyCode(code)) {
        console.log("invalid code", code);
        return;
      }

      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor(cursor - 1);
          totalTyped.current -= 1;
          break;
        default:
          setTyped((prev) => prev.concat(key));
          setCursor(cursor + 1);
          totalTyped.current += 1;
          break;
      }
    },
    [cursor, enabled],
  );

  const reset = () => {
    setTyped("");
    setCursor(0);
    totalTyped.current = 0;
  };

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  return { cursor, typed, totalTyped: totalTyped.current, reset };
};

export default useTyping;
