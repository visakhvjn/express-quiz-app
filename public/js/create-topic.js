document.getElementById('add-subtopic-btn').addEventListener('click', () => {
	const container = document.getElementById('subtopics-container');
	const input = document.createElement('input');
	input.type = 'text';
	input.name = 'subtopics[]';
	input.className = 'form-control subtopic-input';
	input.placeholder = 'Enter subtopic';
	container.appendChild(input);
});
