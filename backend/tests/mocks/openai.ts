/* global jest – automatyczny mock dla biblioteki `openai`   */
const mockChat = {
  completions: {
    create: jest.fn().mockResolvedValue({
      choices: [{ message: { content: '{"mood":"happy"}' } }]
    })
  }
};

const OpenAI = jest.fn().mockImplementation(() => ({
  chat: mockChat
}));

export default OpenAI;
