import { openai } from '../config/openai.js';
import * as topicService from '../services/topic.service.js';
import * as Errors from '../utils/errors.js';

export const generateQuestion = async (topic, subtopics, description) => {
	try {
		const subtopicsText = subtopics.length
			? `Try to focus on the following subtopics: ${subtopics.join(
					', '
			  )} when possible.`
			: 'Focus on the general topic.';

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: `
						You are a helpful assistant creating quiz questions for a quiz application.
						Your task is to generate questions related to the topic "${topic}".
						${topic} is basically ${description}.
						${subtopicsText}
					`,
				},
				{
					role: 'user',
					content: `
						Create a quiz question with the following requirements:
						- The question should be related to "${topic}".
						- Include 4 options.
						- Specify 1 correct answer.
						- Provide a brief explanation for the correct answer.

						The response must be in the following JSON format:
						{
							"question": "What is the capital of France?",
							"options": ["Paris", "London", "Berlin", "Madrid"],
							"answer": "Paris",
							"explanation": "Paris is the capital of France."
						}

						Do not include any additional text or explanation outside the JSON object.
					`,
				},
			],
		});

		// Parse the response and return the question
		const content = response.choices[0]?.message?.content;
		return JSON.parse(content);
	} catch (error) {
		throw new Error('Failed to generate question. Please try again later.');
	}
};

export const getQuestion = async (topicSlug) => {
	try {
		const topic = await topicService.getTopic(topicSlug);

		if (!topic) {
			throw new Errors.NotFoundError(
				`Topic with slug "${topicSlug}" not found.`
			);
		}

		const subtopics = topic.subtopics || [];
		const desscription = topic.description || '';
		const question = await generateQuestion(
			topic.topic,
			subtopics,
			desscription
		);

		return question;
	} catch (error) {
		throw new Errors.AppError(
			'Failed to fetch question. Please try again later.'
		);
	}
};
