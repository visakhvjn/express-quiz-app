import OpenAI from 'openai';
import dotenv from 'dotenv';

import { topics } from './topics.js';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const getQuestion = async () => {
	const topic = getRandomTopic();

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content: `
					You are a helpful assistant who is creating a quiz application related to ${topic} in general.
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

const getRandomTopic = () => {
	const randomIndex = Math.floor(Math.random() * topics.length);
	return topics[randomIndex];
};
