import { useState, useCallback } from "react";

function retrieveText(wordsPerPage, pageNumber) {
  if (pageNumber < 1) {
    console.error("page must be greater than 0");
    return;
  }

  const plainText =
    "hello world, this is a test string that was hard coded !@#$%^&*()_+{}|:\"<>?~`-=[]\\;',./";
  const textArray = plainText.split(" ");

  const result = [];
  for (
    let i = wordsPerPage * (pageNumber - 1);
    i < wordsPerPage * (pageNumber - 1) + wordsPerPage;
    i++
  ) {
    result.push(textArray[i]);
    if (i < textArray.length - 1) {
      result.push(" ");
    }
  }
  return result;
}

function useText(numOfWords, page) {
  const [text, setText] = useState(retrieveText(numOfWords, page));

  const updateText = useCallback(() => {
    setText(retrieveText(numOfWords, page));
  }, [numOfWords, page]);

  return { text, updateText };
}

export default useText;
