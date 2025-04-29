import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const getQuestion = async () => {
	const response = await openai.chat.completions.create({
		model: 'gpt-4.1-nano',
		messages: [
			{
				role: 'system',
				content: `
					You are a helpful assistant who is creating a quiz application related to technology, software engineering, system design etc in general.
					Try not to repeat the topics from previous questions.
					`,
			},
			{
				role: 'user',
				content: `
                    Create a quiz question with 4 options and one correct answer.
                    
                    The question should be related to technology.
                    It should have 4 options.
                    It should have 1 correct option.
                    It should also have a small description or explanation of the answer.

                    The response will be in the form of a JSON object with the following structure:
                    {
                        question: "What is the capital of France?",
                        options: ["Paris", "London", "Berlin", "Madrid"],
                        answer: "Paris",
                        explanation: "Paris is the capital of France."
                    }
                        
                    Do not include any other text or explanation.
                `,
			},
		],
	});

	return response.choices[0].message.content;
};
