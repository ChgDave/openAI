import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AudioContext } from "standardized-audio-context";

function App() {
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const audioContext = new AudioContext();
  const handleClick = async () => {
    const response = await fetch("http://localhost:3001/fetch-answer", {
      method: "POST",
      body: JSON.stringify({ input }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const completion = await response.json();
    const answer = completion.choices[0].message.content;
    const audioReponse = await fetch("http://localhost:3001/fetch-audio", {
      method: "POST",
      body: JSON.stringify({ input: answer }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const audioData = await audioReponse.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
    setInput("");
    setAnswer(answer);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input value={input} onChange={(e) => setInput(e.target.value)}></input>
        <button onClick={() => handleClick()}>Submit</button>
        <p>{answer}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
