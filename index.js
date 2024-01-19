import OpenAI from "openai";
import { config } from "dotenv";
config();
import readline from "readline";
import fs from "fs";
import playSound from "play-sound";

const opts = {};
const player = playSound(opts);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

userInterface.prompt();
userInterface.on("line", async (input) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: input }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0]);
  console.log(completion.choices[0].message.content);
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: completion.choices[0].message.content,
  });
  console.log(response);
  const audioData = await response.arrayBuffer();
  fs.writeFileSync("output.mp3", Buffer.from(audioData));
  player.play("output.mp3", (err) => {
    if (err) {
      console.error("Error playing audio:", err);
    }
  });
});
