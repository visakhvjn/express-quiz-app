import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getQuestion } from './openai.js';

const app = express();

// for handling security vulnerabilities
// by setting HTTP headers appropriately
app.use(helmet());

app.use(cookieParser());

// for serving static files
app.use(express.static('public'));

// for parsing input into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
	let question = JSON.parse(await getQuestion());

	res.cookie('question', JSON.stringify(question));

	res.render('index', {
		...question,
		showExplanation: false,
		showAnswer: false,
	});
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
