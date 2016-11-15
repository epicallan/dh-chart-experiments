import Plottable from 'plottable';

const data = {
	name: 'Sector Distribution of Funds',
	categories: [
		'Infrastructure',
		'Security',
		'Governance',
		'Health',
		'Agriculture'
	],
	groups: [{
		name: 'Uganda',
		values: [12, 34, 54, 65, 400]
	}, {
		name: 'Kenya',
		values: [23, 43, 20, 40, 25]
	}, {
		name: 'Rwanda',
		values: [50, 35, 50, 25, 50]
	}, {
		name: 'Tanzania',
		values: [23, 0, 0, 23, 40]
	}, {
		name: 'Southern Sudan',
		values: [12, 43, 54, 12, 34]
	}]
};

/*
Dataset Preparation
*/
const categoryDatasets = data.categories.map((category, i) =>
	new Plottable.Dataset(data.groups.map((group, j) => ({
		x: group.values[i] / group.values.reduce((s, m) => s + m, 0),
		y: j,
		i
	})))
);


const groupDatasets = data.groups.map(group =>
	new Plottable.Dataset([{
		x: 1,
		y: group.values.reduce((sum, v) => sum + v, 0),
		label: group.name
	}]));

/** **
Category Plot
--------------
**************/
const xScaleCategories = new Plottable.Scales.Linear();
const yScaleCategories = new Plottable.Scales.Category();
const colors = ['#820933', '#D84797', '#D2FDFF', '#3ABEFF', '#26FFE6'];
yScaleCategories.innerPadding(0);
yScaleCategories.outerPadding(0);

const plotCategories = new Plottable.Plots.StackedBar('horizontal')
	.x(d => d.x, xScaleCategories)
	.y(d => d.y, yScaleCategories)
	.attr('fill', (d) => colors[d.i])
	.attr('stroke', '#fff')
	// .labelsEnabled(true)
	.attr('stroke-width', 2);

categoryDatasets.forEach((category) => {
	plotCategories.addDataset(category);
});

/**
Group Plot
*/
const xScaleGroups = new Plottable.Scales.Category();
const yScaleGroups = new Plottable.Scales.Linear();
xScaleGroups.innerPadding(0);
xScaleGroups.outerPadding(0);

const plotGroups = new Plottable.Plots.StackedBar()
	.attr('fill', '#333')
	.attr('stroke', '#fff')
	.attr('stroke-width', 2)
	// .labelsEnabled(true)
	.x((d) => d.x, xScaleGroups)
	.y((d) => d.y, yScaleGroups);

// We reverse the dataset because we want the top group
// to align with to be near to it's categories
groupDatasets.reverse().forEach(group => {
	plotGroups.addDataset(group);
});

/*
Chart Setup
*/
const chart = new Plottable.Components.Table([
	[plotGroups, plotCategories]
]);
chart.columnWeight(0, 1);
chart.columnWeight(1, 10);
chart.columnPadding(200);
chart.renderTo('svg#StackedBar');

/*

Labels Setup
--------------
*/
const categoryEntities = plotCategories.entities();
const groupEntities = plotGroups.entities();

data.groups.forEach((group, i, groups) => {
	const categoryEntity = categoryEntities[i];
	// Reverse index for group entity because we reversed the dataset
	const groupEntity = groupEntities[groups.length - i - 1];
	const categoryRect = categoryEntity.selection[0][0];
	const groupRect = groupEntity.selection[0][0];

	const categoryRectDimensions = {
		x: categoryRect.x.baseVal.value,
		y: categoryRect.y.baseVal.value,
		width: categoryRect.width.baseVal.value,
		height: categoryRect.height.baseVal.value
	};

	const groupRectDimensions = {
		x: groupRect.x.baseVal.value,
		y: groupRect.y.baseVal.value,
		width: groupRect.width.baseVal.value,
		height: groupRect.height.baseVal.value
	};

	const groupStart = {
		x: groupRectDimensions.x + groupRectDimensions.width,
		y: groupRectDimensions.y + groupRectDimensions.height / 2,
	};

	const categoryStart = {
		x: groupRectDimensions.width + 200 - 5,
		y: categoryRectDimensions.y + categoryRectDimensions.height / 2,
	};

	chart.foreground()
		.append('polyline')
		.attr('points', () => [
			[groupStart.x, groupStart.y],
			[groupStart.x + 40 + 10 * i, groupStart.y],
			[groupStart.x + 40 + 10 * i, categoryStart.y],
			[categoryStart.x, categoryStart.y],
		].map(point => point.join(' ')).join(',')
		)
		.attr('stroke', '#aaa')
		.attr('stroke-width', 2)
		.attr('fill', 'transparent');

	chart.foreground()
		.append('text')
		.text(groupEntity.datum.label)
		.attr('style', 'background: #fff')
		.attr('x', categoryStart.x)
		.attr('y', categoryStart.y - 5)
		.attr('text-anchor', 'end');

	chart.foreground()
		.append('text')
		.text(groupEntity.datum.y)
		.attr('style', 'background: #fff')
		.attr('x', groupStart.x)
		.attr('y', groupStart.y - 5)
		.attr('text-anchor', 'start');
});
