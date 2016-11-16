import Plottable from 'plottable';

const scale = new Plottable.Scales.Linear();

const innerRadius = 90;
const outerRadius = 130;

const data = [{
	value: 10,
	color: 'red',
	label: 'south of sahara'
}, {
	value: 90,
	color: 'pink',
	label: 'north of sahara'
}];

const Pie = Plottable.Plots.Pie;


const plot = new Pie()
	.addDataset(new Plottable.Dataset(data))
	.sectorValue(d => d.value, scale)
	.attr('fill', (d) => d.color)
	.attr('stroke', '#fff')
	.attr('stroke-width', '3px')
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.renderTo('svg#pie');

const boundingBox = plot._boundingBox[0][0];
const centerX = boundingBox.width.baseVal.value / 2;
const centerY = boundingBox.height.baseVal.value / 2;

plot.entities().forEach((slice, datumIndex) => {
	const c = slice.component;
	const theta = (c._endAngles[datumIndex] + c._startAngles[datumIndex]) / 2;
	const start = {
		x: centerX + Math.sin(theta) * 115,
		y: centerY + (-Math.cos(theta) * 115)
	};

	const stop = {
		x: centerX + Math.sin(theta) * 140,
		y: centerY + (-Math.cos(theta) * 140)
	};

	const dirX = Math.sin(theta) / Math.abs(Math.sin(theta));

	plot
		.foreground()
		.append('polyline')
		.attr('stroke', '#000')
		.attr('fill', 'transparent')
		.attr('points', () => {
			const points = [
				[start.x, start.y],
				[stop.x, stop.y],
				[centerX + dirX * 90, stop.y]
			];
			return points.map(p => p.join(' ')).join(',');
		});

	plot
		.foreground()
		.append('text')
		.text(`${slice.datum.label}: ${slice.datum.value}%`)
		.attr({
			x: centerX + dirX * 95,
			y: stop.y + 5,
			'text-anchor': dirX > 0 ? 'start' : 'end'
		});
});

window.addEventListener('resize', () => plot.redraw());
