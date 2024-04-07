import classNames from "classnames";

import Caret from "./Caret";

const Character = ({ typed, expected }) => {
  const isCorrect = typed === expected;
  const isSpace = expected === " ";

  return (
    <span
      className={classNames({
        "text-primary-400": isCorrect && !isSpace,
        "text-error-500": !isCorrect && !isSpace,
        "bg-red-500/50": !isCorrect && isSpace,
      })}
    >
      {expected}
    </span>
  );
};

const UserInput = ({ userInput, text, className }) => {
  const typedChars = userInput.split("");
  const splittedText = text.join("").split("");

  return (
    <div className={className}>
      {typedChars.map((char, index) => {
        return (
          <Character
            key={`${char}_${index}`}
            typed={char}
            expected={splittedText[index]}
            status={"primary"}
          >
            {char}
          </Character>
        );
      })}
      <Caret blink={true} />
    </div>
  );
};

export default UserInput;
