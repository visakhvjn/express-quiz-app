import express from 'express';
import * as questionController from '../controllers/question.controller.js';

const router = express.Router();

router.get('/:topic', questionController.getQuestion);
router.post('/:topic/answer', questionController.submitAnswer);

export default router;
