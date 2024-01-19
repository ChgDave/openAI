import OpenAI from "openai";
import { config } from "dotenv";
config();
import readline from "readline";

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
  console.log(completion.choices[0].message.content);
});
