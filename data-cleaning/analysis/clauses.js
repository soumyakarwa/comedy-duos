// clauses.js
import { gptPrompt } from "../../shared/openai.ts";

main();

async function main() {
  try {
    const para = JSON.parse(Deno.args[0]);

    const prompt = `Breakup this ${para} by independent clauses. Provide the output as an array of clauses, like this: 
    ["clause1", "clause2", "clause3"]
    Do not provide any text except the array`;

    const result = await gptPrompt(prompt);

    const arr = result
      .slice(1, -1)
      .split('", "')
      .map((s) => s.replace(/^"/, "").replace(/"$/, ""));

    // Print the array as a JSON string
    console.log(JSON.stringify(arr));
  } catch (error) {
    console.error("Error:", error);
    console.log(JSON.stringify([]));
  }
}
