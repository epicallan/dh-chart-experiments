import Plottable from 'plottable';
import cleanUp from './utility';

const data = {
	name: 'Sector Distribution of Funds',
	categories: [
		'African Development Bank',
		'African Development Fund'
	],
	groups: [{
		name: 'Japan',
		values: [10, 20]
	}, {
		name: 'Sweden',
		values: [25, 30]
	}, {
		name: 'UK',
		values: [2, 130]
	}, {
		name: 'China',
		values: [22, 43]
	}]
};

/*
Dataset Preparation
--------------
*/

const categoryDatasets = data.categories.map((category, i) =>
	new Plottable.Dataset(data.groups.map((group) =>
		({
			y: group.name,
			x: group.values[i],
			i
		})
	))
);

console.log('sidebar', categoryDatasets);
/*
Category Plot
--------------
*/
const xScale = new Plottable.Scales.Linear();
const yScale = new Plottable.Scales.Category();

const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
const yAxis = new Plottable.Axes.Category(yScale, 'left');

const colors = ['#820933', '#D84797', '#D2FDFF', '#3ABEFF', '#26FFE6'];
// xScale.innerPadding(1);
// xScale.outerPadding(3);

const plot = new Plottable.Plots.StackedBar('horizontal')
	.x(d => d.x, xScale)
	.y(d => d.y, yScale)
	.attr('fill', (d) => colors[d.i]);

categoryDatasets.forEach((category) => plot.addDataset(category));

/*
Chart Setup
--------------
**************/
const gridlines = new Plottable.Components.Gridlines(xScale, null);
//
const renderGroup = new Plottable.Components.Group([plot, gridlines]);

const chart = new Plottable.Components.Table([
	[yAxis, renderGroup],
	[null, xAxis]
]);

chart.renderTo('svg#sidebar');

cleanUp('#sidebar', true);
