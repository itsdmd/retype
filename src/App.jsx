import Results from "./components/Results.jsx";

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
const accuracy = 0.982;
const errors = 2;

const GeneratedText = ({ text }) => {
  return <div className="text-4xl text-center text-inactive-500">{words}</div>;
};

function App() {
  return (
    <>
      <GeneratedText text={words} />
      <Results
        accuracy={accuracy}
        errors={errors}
        total={words.length}
        className="mt-5"
      />
    </>
  );
}

export default App;
