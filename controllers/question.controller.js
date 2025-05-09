import * as questionService from '../services/question.service.js';

export const getQuestion = async (req, res) => {
	try {
		const { topic } = req.params;

		const question = await questionService.getQuestion(topic);

		res.cookie('question', JSON.stringify(question));

		res.render('question', {
			...question,
			showExplanation: false,
			showAnswer: false,
			topic,
		});
	} catch (err) {
		res.status(err.statusCode).json({ error: err.message });
	}
};

export const submitAnswer = async (req, res) => {
	try {
		const answerOption = req.body.answer;
		const { topic } = req.params;

		let correctAnswerOption = '';
		let showExplanation = false;

		const question = JSON.parse(req.cookies.question);

		if (question.options[answerOption] === question.answer) {
			showExplanation = true;
		} else {
			question.options.forEach((option, index) => {
				if (option === question.answer) {
					correctAnswerOption = index;
				}
			});
		}

		res.render('question', {
			...question,
			showExplanation: true,
			showAnswer: true,
			answerOption,
			correctAnswerOption,
			topic,
		});
	} catch (err) {
		res.status(err.statusCode).json({ error: err.message });
	}
};
