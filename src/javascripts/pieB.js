import Plottable from 'plottable';
import d3 from 'd3';

const scale = new Plottable.Scales.Linear();
const innerRadius = 90;
const outerRadius = 130;

const data = [{
	color: 'red',
	value: 10,
	label: 'OOF via IBRD'
}, {
	color: 'pink',
	value: 40,
	label: 'ODA via IDA'
}];

const Pie = Plottable.Plots.Pie;


const plot = new Pie()
	.addDataset(new Plottable.Dataset(data))
	.sectorValue(d => d.value, scale)
	.attr('fill', (d) => d.color)
	.attr('stroke', '#fff')
	.attr('stroke-width', '2px')
	.labelsEnabled(true)
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.renderTo('svg#pieB');

const boundingBox = plot._boundingBox[0][0];
const centerX = boundingBox.width.baseVal.value / 2;
const centerY = boundingBox.height.baseVal.value / 2;

plot.entities().forEach((slice, datumIndex) => {
	const c = slice.component;
	const theta = (c._endAngles[datumIndex] + c._startAngles[datumIndex]) / 2;

	const stop = {
		x: centerX + Math.sin(theta) * 150,
		y: centerY + (-Math.cos(theta) * 150)
	};
	const dirX = Math.sin(theta) / Math.abs(Math.sin(theta));
	plot
		.foreground()
		.append('text')
		.text(slice.datum.label)
		.attr({
			class: 'out-labels',
			x: stop.x,
			y: stop.y + 5,
			'text-anchor': dirX > 0 ? 'start' : 'end'
		});
});
d3.select('#pieB')
	.selectAll('.dark-label text')
	.attr('style', 'color:#fff');

window.addEventListener('resize', () => plot.redraw());
