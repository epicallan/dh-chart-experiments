import Plottable from 'plottable';
import cleanUp from './utility';

const data = {
	name: 'Sector Distribution of Funds',
	categories: [
		'Agriculture',
		'Infrastructure',
		'Health',
		'Others'
	],
	groups: [{
		year: '2002',
		values: [10, 20, 30, 50]
	}, {
		year: '2003',
		values: [13, 42, 40, 90]
	}, {
		year: '2004',
		values: [2, 130, 42, 30]
	}, {
		year: '2005',
		values: [2, 130, 42, 30]
	}]
};

/*
Dataset Preparation
--------------
*/

const categoryDatasets = data.categories.map((category, i) =>
	new Plottable.Dataset(data.groups.map((group) =>
		({
			x: group.year,
			y: group.values[i],
			label: category,
			i
		})
	))
);
const yScale = new Plottable.Scales.Linear();
const xScale = new Plottable.Scales.Category();

const yAxis = new Plottable.Axes.Numeric(yScale, 'left');
const xAxis = new Plottable.Axes.Category(xScale, 'bottom');

const colors = ['#820933', '#D84797', '#D2FDFF', '#3ABEFF', '#26FFE6'];
// xScale.innerPadding(1);
// xScale.outerPadding(3);

const plot = new Plottable.Plots.StackedBar()
	.x(d => d.x, xScale)
  .labelsEnabled(true)
	.y(d => d.y, yScale)
	.attr('fill', (d) => colors[d.i]);

categoryDatasets.forEach((category) => plot.addDataset(category));


const gridlines = new Plottable.Components.Gridlines(null, yScale);

const renderGroup = new Plottable.Components.Group([plot, gridlines]);

const chart = new Plottable.Components.Table([
	[yAxis, renderGroup],
	[null, xAxis]
]);

chart.renderTo('svg#bar');

cleanUp('#bar', false);
