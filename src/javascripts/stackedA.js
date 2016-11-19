import Plottable from 'plottable';
import cleanUp from './utility';

const data = {
	name: 'Sector Distribution of Funds',
	groups: [{
		name: 'Uganda',
		colors: ['#D0123B', '#E1646D'],
		values: [20, 34]
	}, {
		colors: ['#37373a', '#434348'],
		name: 'Kenya',
		values: [10, 43]
	}, {
		name: 'Rwanda',
		colors: ['#F46F17', '#e0964b'],
		values: [12, 45]
	}]
};

/*
Dataset Preparation
*/
// {name,sum,categories: [...{name, value}]}
const categories = {
	Uganda: ['Infrastructure is a long word that should wrap nicely', 'Security'],
	Kenya: ['roads ', 'health'],
	Rwanda: ['Health', 'medicare'],
};

const groups = data.groups.map(group =>
	({
		name: group.name,
		sum: group.values.reduce((s, v) => s + v, 0),
		color: group.colors[0],
		categories: group.values
			.map((value, index) => ({
				name: categories[group.name][index],
				value,
				color: group.colors[index]
			}))
			.sort((a, b) => a.value - b.value)
	}));

/*
Scale
--------------
**************/
const xScale = new Plottable.Scales.Category();
const yScale = new Plottable.Scales.Linear();

xScale.innerPadding(0);
xScale.outerPadding(0);

const yAxis = new Plottable.Axes.Numeric(yScale, 'left')
	.formatter(t => (t * 100).toString());

/*
Chart Setup
--------------
**************/
const chart = new Plottable.Components.Table([
	[null],
	[yAxis]
]);

/*
Labels
--------------
**************/
const Bar = Plottable.Plots.Bar;
const StackedBar = Plottable.Plots.StackedBar;
/* eslint-disable func-names*/
const _drawLables = function () {
	this.entities()
		.forEach(entity => {
			const rect = entity.selection[0][0];
			const baseline = rect.parentNode.parentNode.lastChild;
			if (rect.height.baseVal.value > 30) {
				this.foreground()
					.append('foreignObject')
					.attr('width', rect.width.baseVal.value)
					.attr('height', rect.height.baseVal.value / 2)
					.attr('x', baseline.x1.baseVal.value)
					.attr('y', rect.y.baseVal.value + rect.height.baseVal.value / 2)
					.append('xhtml:body')
					.html(`<p class = 'p-labels'>${entity.datum.label}, ${entity.datum.value}</p>`);
			}
		});
};

Bar.prototype._drawLabels = _drawLables;
StackedBar.prototype._drawLabels = _drawLables;

/*
Plots
--------------
**/
groups.forEach((group, index) => {
	const plotGroups = new Bar()
		.attr('style', 'width: 100%')
		.attr('fill', d => d.color)
		.x(d => d.x, xScale)
		.attr('stroke', '#fff')
		.attr('stroke-width', 2)
		.y(d => d.y, new Plottable.Scales.Linear())
		.labelsEnabled(true)
		.addDataset(new Plottable.Dataset([{
			x: 1,
			y: 1,
			color: group.color,
			label: group.name,
			value: group.sum
		}]));

	const plotCategories = new StackedBar()
		.attr('style', 'width: 100%')
		.attr('fill', d => d.color)
		.attr('stroke', '#fff')
		.attr('stroke-width', 2)
		.labelsEnabled(true)
		.x(d => d.x, xScale)
		.y(d => d.y, yScale);

	group.categories.forEach((category) => {
		plotCategories.addDataset(new Plottable.Dataset([{
			x: 1,
			y: category.value / group.sum,
			label: category.name,
			value: category.value,
			color: category.color
		}]));
	});

	chart
		.add(plotGroups, 0, index + 1)
		.add(plotCategories, 1, index + 1)
		.columnWeight(index + 1, group.sum);
});

chart.rowWeight(1, 4);
chart.renderTo('svg#stackedA');
cleanUp('#stackedA', false, false, true);
