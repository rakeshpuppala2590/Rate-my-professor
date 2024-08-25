import OpenAI  from 'openai';

export async function analyzeComments(commentsAndRatings) {
  try {
    const responses = await Promise.all(commentsAndRatings.map(async (entry) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Analyze the professor comments and provide insights.' },
          { role: 'user', content: `Comment: ${entry.comments}. Rating: ${entry.rating}.` },
        ],
        max_tokens: 150,
      });
      return {
        comments: entry.comments,
        rating: entry.rating,
        analysis: response.choices[0].message.content,
      };
    }));

    return responses;
  } catch (error) {
    console.error('Error analyzing comments:', error);
    return { error: 'An error occurred while analyzing comments.' };
  }
}
