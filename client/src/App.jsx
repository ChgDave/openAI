import { useState, useRef, useEffect } from "react";
import Typewriter from "typewriter-effect/dist/core";
import AILogo from "/AI.png";
import "./App.css";
// import { AudioContext } from "standardized-audio-context";

function App() {
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const answerDisplay = useRef(null);

  const handleClick = async () => {
    const response = await fetch("https://bb-88.onrender.com/fetch-answer", {
      method: "POST",
      body: JSON.stringify({ input }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const completion = await response.json();
    const answer = completion.choices[0].message.content;
    const audioReponse = await fetch("https://bb-88.onrender.com/fetch-audio", {
      method: "POST",
      body: JSON.stringify({ input: answer }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const audioData = await audioReponse.arrayBuffer();
    const audio = new Audio();
    audio.src = URL.createObjectURL(new Blob([audioData]));
    audio.play();
    // code below uses audiocontext libraby
    // const audioBuffer = await audioContext.decodeAudioData(audioData);
    // const sourceNode = audioContext.createBufferSource();
    // sourceNode.buffer = audioBuffer;
    // sourceNode.connect(audioContext.destination);
    // sourceNode.start();
    setInput("");
    setAnswer(answer);

    const typewriter = new Typewriter(answerDisplay.current, {
      strings: answer,
      autoStart: true,
      loop: false,
      delay: 50,
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Trigger button click event when Enter key is pressed
      inputRef.current.click();
    }
  };

  return (
    <>
      <div>
        <img src={AILogo} className="logo" alt="Vite logo" />
      </div>
      <h1>BB-88</h1>
      <div className="card">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          type="text"
          placeholder="How can I help you?"
        ></input>
        <button ref={inputRef} onClick={() => handleClick()}>
          Submit
        </button>
      </div>
      <div className="answer">
        <p ref={answerDisplay}></p>
      </div>
    </>
  );
}

export default App;
