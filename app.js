import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import './config/db.js';

import topicRoutes from './routes/topic.routes.js';
import questionRoutes from './routes/question.routes.js';

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/topics', topicRoutes);
app.use('/question', questionRoutes);

app.get('/', (req, res) => {
	res.render('landing');
});

app.post('/submit-answer', async (req, res) => {
	const answerOption = req.body.answer;

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

	res.render('index', {
		...question,
		showExplanation: true,
		showAnswer: true,
		answerOption,
		correctAnswerOption,
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
