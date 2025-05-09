import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
	topic: { type: String, required: true },
	description: String,
	subtopics: [String],
	createdAt: { type: Date, default: Date.now() },
});

export const topicModel = mongoose.model('Topic', topicSchema);
