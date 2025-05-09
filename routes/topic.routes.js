import express from 'express';
import * as topicController from '../controllers/topic.controller.js';

const router = express.Router();

router.get('/create', topicController.createTopicView);
router.post('/', topicController.createTopic);
router.get('/', topicController.getTopics);

export default router;
