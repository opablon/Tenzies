import { useState, useEffect } from "react";
import "./Die.css";

function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  const dotArray = [];

  for (var i = 0; i < props.value; i++) {
    dotArray.push(<div className="pip"></div>);
  }

  const dotMap = dotArray.map((dot) => dot);

  return (
    <div className="die-face-dots" style={styles} onClick={props.holdDice}>
      {dotMap}
    </div>
  );
}

export default Die;
