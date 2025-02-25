import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-6a2f98abbba74c01a85a953b7c7f9ae2',
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
    model: 'deepseek-chat',
  });

  console.log(completion.choices[0].message.content);
}

main();
