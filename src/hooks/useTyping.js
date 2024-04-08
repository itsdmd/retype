import { useCallback, useState, useRef, useEffect } from "react";

function isAllowedKeyCode(code) {
  return (
    code.startsWith("Key") ||
    code.startsWith("Digit") ||
    code.startsWith("Numpad") ||
    code.startsWith("Bracket") ||
    code.endsWith("colon") ||
    code.toLowerCase().endsWith("slash") ||
    code.toLowerCase().endsWith("quote") ||
    code === "Space" ||
    code === "Backspace" ||
    code === "Period" ||
    code === "Comma" ||
    code === "Add" ||
    code === "Minus" ||
    code === "Equal"
  );
}

function useTyping(enabled = true) {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState("");
  const totalTyped = useRef(0);

  const keydownHandler = useCallback(
    (event) => {
      event.preventDefault();
      if (!enabled) {
        console.log("not enabled");
        return;
      }
      if (!isAllowedKeyCode(event.code)) {
        console.log("invalid code", event.code);
        return;
      }

      switch (event.key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor(cursor - 1);
          totalTyped.current -= 1;
          break;
        default:
          setTyped((prev) => prev.concat(event.key));
          setCursor(cursor + 1);
          totalTyped.current += 1;
          break;
      }
    },
    [cursor, enabled],
  );

  function reset() {
    setTyped("");
    setCursor(0);
    totalTyped.current = 0;
  }

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  return { cursor, typed, totalTyped: totalTyped.current, reset };
}

export default useTyping;
