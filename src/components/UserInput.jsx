import Caret from "./Caret";

const Character = ({ char }) => {
  return <span className="text-primary-500">{char}</span>;
};

const UserInput = ({ userInput, className }) => {
  const characters = userInput.split("");

  return (
    <div className={className}>
      {characters.map((char, index) => {
        return (
          <Character key={`${char}_${index}`} char={char} status={"primary"}>
            {char}
          </Character>
        );
      })}
      <Caret blink={true} />
    </div>
  );
};

export default UserInput;
