import React, { useState } from "react";

import useEngine from "./hooks/useEngine.js";

import Results from "./components/Results.jsx";
import UserInput from "./components/UserInput.jsx";
import TextContainer from "./components/TextContainer.jsx";

const str = "test test test test test test";
const accuracy = 0.982;
const errors = 2;

const OriginalText = ({ text }) => {
  return <div className="text-secondary-500">{text}</div>;
};

function App() {
  const { state, text, typed } = useEngine();
  return (
    <>
      <TextContainer>
        <OriginalText text={text} />
        <UserInput className="absolute inset-0" userInput={typed} text={text} />
      </TextContainer>

      <Results
        accuracy={accuracy}
        errors={errors}
        total={text.length}
        className="mt-10"
      />
    </>
  );
}

export default App;
