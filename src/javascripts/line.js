import Plottable from 'plottable';
import cleanUp from './utility';

const data = [
	[{
		x: 2015,
		y: 10
	}, {
		x: 2014,
		y: 12
	}, {
		x: 2013,
		y: 50
	}, {
		x: 2012,
		y: 24
	}, {
		x: 2011,
		y: 61
	}, {
		x: 2010,
		y: 31
	}],
	[{
		x: 2015,
		y: 20
	}, {
		x: 2014,
		y: 2
	}, {
		x: 2013,
		y: 20
	}, {
		x: 2012,
		y: 41
	}, {
		x: 2011,
		y: 11
	}, {
		x: 2010,
		y: 2
	}]
];
const colors = ['#cf1b44', '#e1817c'];
const labels = ['ODA', 'OOF'];
const datasets = data.map(d => new Plottable.Dataset(d));

const xScale = new Plottable.Scales.Category();
const yScale = new Plottable.Scales.Linear();

const xAxis = new Plottable.Axes.Category(xScale, 'bottom');
const yAxis = new Plottable.Axes.Numeric(yScale, 'left');


xScale.outerPadding(1);

const plot = new Plottable.Plots.Line()
	.x((d) => d.x, xScale)
	.y((d) => d.y, yScale)
	.attr('stroke-width', 3);

datasets.forEach((dataset) => plot.addDataset(dataset));

const gridlines = new Plottable.Components.Gridlines(null, yScale);

const renderGroup = new Plottable.Components.Group([plot, gridlines]);

const chart = new Plottable.Components.Table([
	[yAxis, renderGroup],
	[null, xAxis]
]);

chart.renderTo('svg#line');
// change line colors
plot.selections()[0].forEach((path, index) => {
	path.setAttribute('stroke', colors[index]);
	const point = path.getPointAtLength(path.getTotalLength());
	plot.foreground()
		.append('text')
		.text(labels[index])
		.attr({
			x: point.x + 10,
			y: point.y + 5
		});
});

cleanUp('#line');
