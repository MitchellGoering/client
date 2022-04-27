import React, { useState } from 'react';

function App() {
  const [guessCounter, setGuessCounter] = useState(0);
  const [guess, setGuess] = useState("");
  const [victory, setVictory] = useState(false);

  const [response, setResponse] = useState([
    [[' ', 3], [' ', 3], [' ', 3], [' ', 3], [' ', 3]],
    [[' ', 3], [' ', 3], [' ', 3], [' ', 3], [' ', 3]],
    [[' ', 3], [' ', 3], [' ', 3], [' ', 3], [' ', 3]],
    [[' ', 3], [' ', 3], [' ', 3], [' ', 3], [' ', 3]],
    [[' ', 3], [' ', 3], [' ', 3], [' ', 3], [' ', 3]],
    [[' ', 3], [' ', 3], [' ', 3], [' ', 3], [' ', 3]]
  ])

  const checkVictory = () => {
    const winner = response[guessCounter].every(item => item[1] === 2)
    if (winner === true) {
      setVictory(true)
    }
  }

  const handleChange = (event) => {
    setGuess(event.target.value)
  }

  const checkWord = (event) => {
    event.preventDefault()

    if (canGuess()) {
      return;
    }

    const requestOptions = {
      method:"POST", 
      headers: {"content-type": "application/json"},
      body: JSON.stringify({guess:guess})
    }
    fetch("http://localhost:5000/check", requestOptions)
      .then((response) => response.json())
      .then(displayGuess)
      .then(incrementGuessCounter)
      .then(checkVictory)
      .catch((err) => console.error(err))
  }

  const displayGuess = (guess) => {
    response[guessCounter] = guess
    setResponse(response)
  }

  const incrementGuessCounter = () => {
    setGuessCounter(guessCounter + 1)
  }

  // DRY (Don't repeat yourself) and it is the D in SOLID
  const canGuess = () => {
    return guessCounter >= 6
  }

  let message;
  if (victory === true) {
    message = <div><h1> congrats! </h1></div>;
  } else if (victory === false && canGuess()) {
    message = <div><h2> try again tomorrow! </h2></div>;
  } else {
    message = <h3> guess a word! </h3>;
  }

  return (
  <div>
    <div>
      {message}
    </div>    
    <form onSubmit={checkWord}>
      <label>
          Guess: 
          <input type="text" value={guess} onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
    <div className="wordle-grid">
      {
        response.map(guess => {
          return guess.map(letter => {
            if (letter[0] === null) {
              return (<div className="letter color-blank"></div>)
            } else {
              return (
                <div className={`letter color-${letter[1]}`}>{letter[0]}</div>
              )
            }
          })
        })
      }
    </div>
  </div>
  );}

export default App;
