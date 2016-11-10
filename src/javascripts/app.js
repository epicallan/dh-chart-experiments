import pie from './pie';

document.addEventListener('DOMContentLoaded', () => {
	const piePlot = pie('svg#pie');
	const entities = piePlot.entities();
	console.log('entities', entities);
}, false);
