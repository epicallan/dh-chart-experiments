import Plottable from 'plottable';
import d3 from 'd3';

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
		y: 21
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
	}]
];

const datasets = data.map(d => new Plottable.Dataset(d))

const xScale = new Plottable.Scales.Category();
const yScale = new Plottable.Scales.Linear();


const xAxis = new Plottable.Axes.Category(xScale, 'bottom');
const yAxis = new Plottable.Axes.Numeric(yScale, 'left');

xScale.outerPadding(1);

const plot = new Plottable.Plots.Line()
	.x((d) => d.x, xScale)
	.y((d) => d.y, yScale);

datasets.forEach(s => plot.addDataset(s));

const gridlines = new Plottable.Components.Gridlines(null, yScale);

const renderGroup = new Plottable.Components.Group([plot, gridlines]);

const chart = new Plottable.Components.Table([
	[yAxis, renderGroup],
	[null, xAxis]
]);

chart.renderTo('svg#line');

// grid lines configurations
d3.select('.y-gridlines')
	.selectAll('line')
	.attr('stroke-dasharray', '2 5')
	.attr('stroke-width', 1);

// YAxis
const yaxisElm = d3.select('.y-axis');
yaxisElm.select('.tick-mark-container').remove();
yaxisElm.select('.baseline').remove();

// add Labels;
// const lineALastEntity = entities[entities.length / 2 - 1];
// const lineBlastEntity = entities[entities.length - 1];

datasets.forEach(set => {
	const entities = plot.entities([set]);
	const path = entities[0].selection[0][0];
	const point = path.getPointAtLength(path.getTotalLength());

	plot.foreground()
		.append('text')
		.text('Hello')
		.attr({
			x: point.x + 10,
			y: point.y + 5
		});
});
