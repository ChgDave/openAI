import OpenAI from "openai";
import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";

const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/fetch-answer", async (req, res) => {
  try {
    console.log(req.body.input);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: req.body.input }],
      model: "gpt-3.5-turbo",
    });
    console.log(completion);
    // const audio = await openai.audio.speech.create({
    //   model: "tts-1",
    //   voice: "alloy",
    //   input: completion.choices[0].message.content,
    // });
    // console.log("audio", audio);
    res.json(completion).status(200);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" }), console.log(e);
  }
});

app.post("/fetch-audio", async (req, res) => {
  try {
    console.log("message", req.body.input);
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: req.body.input,
    });
    console.log(response);
    const audioBuffer = await response.buffer();
    res.setHeader("Content-Type", "audio/wav");
    res.send(audioBuffer).status(200);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" }), console.log(e);
  }
});

app.get("/fetch-answer", async (req, res) => {
  try {
    console.log("fetch answer");
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "tell me a joke" }],
      model: "gpt-3.5-turbo",
    });
    console.log(completion.choices[0].message.content);
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: completion.choices[0].message.content,
    });
    res.json({ completion, response }).status(200);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" }), console.log(e);
  }
});

app.get("/test", async (req, res) => {
  try {
    console.log("This is a test");
    res.json({ message: "success" }).status(200);
  } catch (e) {
    console.log(e);
  }
});
