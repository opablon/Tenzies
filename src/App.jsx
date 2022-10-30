import { useState, useEffect } from "react";
import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [counter, setCounter] = useState(0);
  const [isCounterActive, setIsCounterActive] = useState(false);
  const [best, setBest] = useState(
    JSON.parse(localStorage.getItem("best")) || { roll: 0, time: 0 }
  );

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setIsCounterActive(false);
    }
  }, [dice]);

  useEffect(() => {
    if (isCounterActive) {
      const interval = setInterval(
        () => setCounter((prevCounter) => prevCounter + 1),
        1000
      );

      return () => clearInterval(interval);
    }
  }, [isCounterActive]);

  useEffect(() => {
    if (tenzies) {
      if (rolls < best.roll || best.roll === 0) {
        setBest((prevBest) => {
          return { ...prevBest, roll: rolls };
        });
      }
      if (counter < best.time || best.time === 0) {
        setBest((prevBest) => {
          return { ...prevBest, time: counter };
        });
      }
    }
  }, [tenzies]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      if (!isCounterActive) {
        setIsCounterActive(true);
      }
      setRolls((prevRolls) => prevRolls + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      localStorage.setItem("best", JSON.stringify(best));
      setTenzies(false);
      setRolls(0);
      setCounter(0);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    if (!isCounterActive) {
      setIsCounterActive(true);
    }
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="time-container">
        <div className="rolls">Rolls: {rolls}</div>
        <div className="timer">Time: {counter}</div>
      </div>
      <div className="time-container">
        <div className="rolls">
          <strong>Best: {best.roll}</strong>
        </div>
        <div className="timer">
          <strong>Best: {best.time}</strong>
        </div>
      </div>
    </main>
  );
}

export default App;
