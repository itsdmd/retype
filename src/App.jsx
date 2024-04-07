import Results from "./components/Results.jsx";
import UserInput from "./components/UserInput.jsx";
import TextContainer from "./components/TextContainer.jsx";

const words = [
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
const str = "test test test test test test";
const accuracy = 0.982;
const errors = 2;

const OriginalText = ({ text }) => {
  return <div className="text-secondary-500">{words}</div>;
};

function App() {
  return (
    <>
      <TextContainer>
        <OriginalText text={words} />
        <UserInput className="absolute inset-0" userInput={str} />
      </TextContainer>

      <Results
        accuracy={accuracy}
        errors={errors}
        total={words.length}
        className="mt-10"
      />
    </>
  );
}

export default App;
