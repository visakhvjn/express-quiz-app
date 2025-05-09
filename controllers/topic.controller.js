import * as topicService from '../services/topic.service.js';

export const createTopicView = async (req, res) => {
	res.render('create-topic');
};

export const createTopic = async (req, res) => {
	try {
		const { topic, description, subtopics } = req.body;

		const createdTopic = await topicService.createTopic(
			topic,
			description,
			subtopics
		);

		if (createdTopic) {
			res.redirect('/topics');
		}
	} catch (err) {
		res.status(err.statusCode).json({ error: err.message });
	}
};

export const getTopics = async (req, res) => {
	try {
		const topics = await topicService.getTopics();
		res.render('topics', { topics });
	} catch (err) {
		res.status(err.statusCode).json({ error: err.message });
	}
};
