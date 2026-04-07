import { getGroqResponse } from "./services/groqService.js";

const run = async () => {
  const res = await getGroqResponse(
    "Mujhe ek acchi romantic movie suggest karo",
    "user1"
  );

  console.log(res);
};

run();