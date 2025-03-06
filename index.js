import model from './config/Gemini.js'
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot Program!'));
  console.log(colors.bold.green('You can start chatting with the bot.'));

  const chatHistory = []; // Store conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Update history with user input
      chatHistory.push({role:'user', parts: [{ text: userInput }],});


      // Call the API with user input & history
      const chat = model.startChat({
        history:chatHistory,
      });


      // Get completion text/content
      let result = await chat.sendMessage(userInput);
      const completionText = result.response.text();

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with user input and assistant response
     
      chatHistory.push({role:'model', parts: [{ text: completionText }],});
    } catch (error) {
      if (error.response) {
        console.error(colors.red(error.response.data.error.code));
        console.error(colors.red(error.response.data.error.message));
        return;
      }
      console.error(colors.red(error));
      return;
    }
  }
}

main();