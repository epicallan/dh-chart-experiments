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

plot.entities().forEach((a, i) => {
	const c = a.component;
	const theta = c._endAngles[i] - c._startAngles[i];
	const angle = Math.PI - (c._startAngles[i] + theta / 2);
	const k = angle < 0 ?
		-0.5 * Math.PI :
		0.5 * Math.PI;

	const start = {
		x: cx + Math.sin(angle) * 110,
		y: cy + Math.cos(angle) * 110
	};

	const stop = {
		x: cx + Math.sin(angle) * 125,
		y: cy + Math.cos(angle) * 125
	};

	const textStart = {
		x: cx + Math.sin(angle) * 160,
		y: cy + Math.cos(angle) * 160
	};

	plot
		.foreground()
		.append('polyline')
		.attr('stroke', '#000')
		.attr('fill', 'transparent')
		.attr('points', () => {
			const points = [
				[start.x, start.y],
				[stop.x, stop.y],
				[cx + Math.sin(k) * 130, stop.y]
			];
			return points.map(p => p.join(' ')).join(',');
		});

	plot
		.foreground()
		.append('text')
		.text(a.datum)
		.attr({
			x: cx + Math.sin(k) * 135,
			y: stop.y + 5,
			'text-anchor': angle > 0 ? 'start' : 'end'
		});

	plot
		.foreground()
		.append('circle')
		.attr({
			stroke: '#000',
			cx: start.x,
			cy: start.y,
			r: 1
		});
});

window.addEventListener('resize', () => plot.redraw());
