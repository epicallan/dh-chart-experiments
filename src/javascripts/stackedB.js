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
--------------
*/
const groups = data.groups.map(group =>
	({
		name: group.name,
		sum: group.values.reduce((s, v) => s + v, 0),
		categories: group.values.map((v, i) => ({
			name: data.categories[i],
			value: v
		}))
	}));

/*
Scales
--------------
*/
const xScaleCategories = new Plottable.Scales.Category();
const yScaleCategories = new Plottable.Scales.Linear();
const colors = ['#820933', '#D84797', '#D2FDFF', '#3ABEFF', '#26FFE6'];
xScaleCategories.innerPadding(0);
xScaleCategories.outerPadding(0);

const xScaleGroups = new Plottable.Scales.Category();
const yScaleGroups = new Plottable.Scales.Linear();
xScaleGroups.innerPadding(0);
xScaleGroups.outerPadding(0);


/*
Chart Setup
--------------
*/
const chart = new Plottable.Components.Table();

/*
Plot
--------------
*/
const sumOfGroups = groups.reduce((s, g) => s + g.sum, 0);

groups.forEach((group, index) => {
	const plotCategories = new Plottable.Plots.StackedBar()
		.x(d => d.x, xScaleCategories)
		.y(d => d.y, yScaleCategories)
		.labelsEnabled(true)
		.attr('fill', (d) => colors[d.i])
		.attr('style', 'width: 100%')
		.attr('stroke', '#fff')
		.attr('stroke-width', 2);

	group.categories.forEach((category, i) => {
		plotCategories.addDataset(new Plottable.Dataset([{
			x: 1,
			label: 'lukwago',
			y: category.value / group.sum,
			i
		}]));
	});

	const plotGroups = new Plottable.Plots.Bar()
		.attr('fill', '#333')
		.attr('stroke', '#fff')
		.attr('stroke-width', 2)
		.attr('style', 'width: 100%')
		.x((d) => d.x, xScaleGroups)
		.y((d) => d.y, yScaleGroups)
		.labelsEnabled(true)
		.addDataset(new Plottable.Dataset([{
			x: 1,
			y: 1,
			label: 'allan'
		}]));

	chart.add(plotGroups, 0, index);
	chart.add(plotCategories, 1, index);
	chart.columnWeight(index, Math.round(group.sum * 10 / sumOfGroups));
});

chart.rowPadding(0);
chart.rowWeight(1, 4);
chart.columnPadding(0);
chart.renderTo('svg#stackedB');
