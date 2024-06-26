import { useState } from "react";

import useText from "./useText";
import useTyping from "./useTyping";

function useEngine() {
  const [state, setState] = useState("start");
  const { text, updateText } = useText(100, 1);
  const { cursor, typed, totalTyped, reset } = useTyping(state !== "stop");

  return { state, text, typed };
}

export default useEngine;
