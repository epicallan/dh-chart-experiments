import Plottable from 'plottable';
import cleanUp from './utility';

const data = {
	name: 'Sector Distribution of Funds',
	categories: [
		'Infrastructure',
		'Security',
		'Governance',
		'Health',
	],
	groups: [{
		name: 'Uganda',
		values: [10, 20, 40, 30]
	}, {
		name: 'Kenya',
		values: [25, 30, 40, 5]
	}]
};

/*
Dataset Preparation
--------------
*/

const categoryDatasets = data.categories.map((category, i) =>
  new Plottable.Dataset(data.groups.map((group) =>
  ({ x: group.name,
		y: group.values[i],
		label: category,
		i
		})
	))
);

/*
Category Plot
--------------
*/
const xScaleCategories = new Plottable.Scales.Category();
const yScale = new Plottable.Scales.Linear();

const xAxis = new Plottable.Axes.Category(xScaleCategories, 'bottom');

const yAxis = new Plottable.Axes.Numeric(yScale, 'left');

const colors = ['#820933', '#D84797', '#D2FDFF', '#3ABEFF', '#26FFE6'];
xScaleCategories.innerPadding(1);
xScaleCategories.outerPadding(3);

const plot = new Plottable.Plots.StackedBar()
	.x(d => d.x, xScaleCategories)
	.y(d => d.y, yScale)
  // .labelFormatter((d) => flatDatasets.find(obj => obj.y === d).value.toString())
  .labelsEnabled(true)
	.attr('width', 50)
	.attr('fill', (d) => colors[d.i]);

categoryDatasets.forEach((category) => plot.addDataset(category));

/*
Chart Setup
--------------
**************/
const gridlines = new Plottable.Components.Gridlines(null, yScale);

const renderGroup = new Plottable.Components.Group([plot, gridlines]);

const chart = new Plottable.Components.Table([
	[yAxis, renderGroup],
	[null, xAxis]
]);

chart.renderTo('svg#columnA');

/*
Labels Setup
--------------
**************/
categoryDatasets.forEach((dataset) => {
	const categoryEntities = plot
		.entities([dataset])
		.sort((a, b) => a.datum.y - b.datum.y);

	const labeledEntity = categoryEntities.pop();
	const otherEntity = categoryEntities.pop();

	const labeledSelection = labeledEntity.selection[0][0];
	const otherSelection = otherEntity.selection[0][0];

	const labeledRectDimensions = {
		x: labeledSelection.x.baseVal.value,
		y: labeledSelection.y.baseVal.value,
		width: labeledSelection.width.baseVal.value,
		height: labeledSelection.height.baseVal.value,
	};

	const otherRectDimensions = {
		x: otherSelection.x.baseVal.value,
		y: otherSelection.y.baseVal.value,
		width: otherSelection.width.baseVal.value,
		height: otherSelection.height.baseVal.value,
	};

	const endRect = labeledRectDimensions.x > otherRectDimensions.x ?
		labeledRectDimensions :
		otherRectDimensions;

	const start = {
		x: labeledRectDimensions.x + labeledRectDimensions.width,
		y: labeledRectDimensions.y + labeledRectDimensions.height / 2,
	};

	const end = {
		x: endRect.x + endRect.width * 9 / 8,
		y: start.y,
	};

	plot.foreground()
		.append('text')
		.text(labeledEntity.datum.label)
		.attr('text-anchor', 'start')
		.attr('x', end.x + 5)
		.attr('y', end.y + 5);

	plot.foreground()
		.append('line')
		.attr({
			stroke: '#000',
			x1: start.x,
			y1: start.y,
			x2: end.x + 5,
			y2: end.y,
		});
});
cleanUp('#columnA');
