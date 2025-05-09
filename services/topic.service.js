import OpenAI from 'openai';
import dotenv from 'dotenv';

import { topicModel } from '../models/topic.model.js';
import * as Errors from '../utils/errors.js';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const getTopics = async () => {
	const topics = await topicModel.find({});
	return topics;
};
export const getTopic = async (topic) => {
	const foundTopic = await topicModel.findOne({ topic });

	if (!foundTopic) {
		throw new Errors.NotFoundError('Topic not found!');
	}

	return foundTopic;
};

export const getSubTopics = (topic) => {};

export const createTopic = async (topic, description, subtopics) => {
	// check if topic exits
	let existingTopic = await topicModel.findOne({
		topic: topic.toLowerCase(),
	});

	if (existingTopic) {
		throw Errors.ConflictError(`Topic ${topic} already exists!`);
	}

	// generate sub topics for the topic
	if (!subtopics.length < 10) {
		subtopics = [
			...subtopics,
			...(await generateSubTopics(topic, 10 - subtopics.length)),
		];
	}

	await topicModel.create({
		topic,
		description,
		subtopics,
	});

	return topicModel.findOne({ topic });
};

export const generateSubTopics = async (topic, count) => {
	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: 'You are an expert curriculum designer.',
				},
				{
					role: 'user',
					content: subTopicsPrompt(topic, count),
				},
			],
			temperature: 0.7,
			max_tokens: 500,
		});

		const subtopics = JSON.parse(response.choices[0].message.content);
		return subtopics;
	} catch (error) {
		return [];
	}
};

const subTopicsPrompt = (topic, count) => {
	return `Generate ${count} specific subtopics for learning ${topic}.

    Requirements:
    - Generate exactly ${count} subtopics
    - Each subtopic should be focused and specific
    - Order from basic to advanced concepts
    - Make each subtopic unique and clear

    Return ONLY a JSON array of strings. Example format:
    ["Basic Concept 1", "Basic Concept 2", "Intermediate Topic", "Advanced Topic"]

    Do not include any additional text or explanations outside the array.`;
};
