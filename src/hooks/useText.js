import { useState, useCallback } from "react";

const retrieveText = (numOfWords, page) => {
  const text = [
    "hello",
    " ",
    "world",
    " ",
    "this",
    " ",
    "is",
    " ",
    "a",
    " ",
    "test",
  ];
  return text;
};

const useText = (count, page) => {
  const [text, setText] = useState(retrieveText(count, page));

  const updateText = useCallback(() => {
    setText(retrieveText(count, page));
  }, [count, page]);

  return { text, updateText };
};

export default useText;
