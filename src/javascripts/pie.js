import Plottable from 'plottable';

const scale = new Plottable.Scales.Linear();

const colorScale = new Plottable.Scales
	.InterpolatedColor()
	.range(['#BDCEF0', '#5279C7']);
const innerRadius = 100;
const outerRadius = 120;

const data = [10, 20, 30, 40, 50, 60, 5];

const Pie = Plottable.Plots.Pie;


const plot = new Pie()
	.addDataset(new Plottable.Dataset(data))
	.sectorValue(d => d, scale)
	.attr('fill', (d) => d, colorScale)
	.attr('stroke', '#fff')
	.attr('stroke-width', '3px')
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.renderTo('svg#pie');

const boundingBox = plot._boundingBox[0][0];
const cx = boundingBox.width.baseVal.value / 2;
const cy = boundingBox.height.baseVal.value / 2;

plot.entities().forEach((slice, datumIndex) => {
	const c = slice.component;
	const theta = (c._endAngles[datumIndex] + c._startAngles[datumIndex]) / 2;
	const start = {
		x: cx + Math.sin(theta) * 115,
		y: cy + (-Math.cos(theta) * 115)
	};

	const stop = {
		x: cx + Math.sin(theta) * 140,
		y: cy + (-Math.cos(theta) * 140)
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
				[cx + dirX * 150, stop.y]
			];
			return points.map(p => p.join(' ')).join(',');
		});

	plot
		.foreground()
		.append('text')
		.text(slice.datum)
		.attr({
			x: cx + dirX * 150,
			y: stop.y + 5,
			'text-anchor': dirX > 0 ? 'start' : 'end'
		});
});

window.addEventListener('resize', () => plot.redraw());
