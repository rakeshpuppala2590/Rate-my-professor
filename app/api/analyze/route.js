import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeComments(professors) {
  try {
    const responses = await Promise.all(professors.map(async (professor) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Analyze the professor comments and provide insights.' },
          { role: 'user', content: `Comment: ${professor.comment}. Rating: ${professor.rating}.` },
        ],
        max_tokens: 150,
      });

      console.log(response)

      return {
        comment: professor.comment,
        rating: professor.rating,
        analysis: response.choices[0].message.content,
      };
    }));

    return responses;
  } catch (error) {
    console.error('Error analyzing comments:', error);
    return { error: 'An error occurred while analyzing comments.' };
  }
}
