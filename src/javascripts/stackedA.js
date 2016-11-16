import Plottable from 'plottable';
import cleanUp from './utility';

const data = {
	name: 'Sector Distribution of Funds',
	categories: ['Infrastructure', 'Security', 'Governance', 'Health', 'Agriculture'],
	groups: [{
		name: 'Uganda',
		values: [12, 34, 54, 65, 80]
	}, {
		name: 'Kenya',
		values: [23, 43, 20, 40, 25]
	}, {
		name: 'Rwanda',
		values: [50, 35, 50, 25, 50]
	}, {
		name: 'Southern Sudan',
		values: [12, 43, 54, 12, 34]
	}]
};

/*
Dataset Preparation
*/

const groups = data.groups.map(group =>
	({
		name: group.name,
		sum: group.values.reduce((s, v) => s + v, 0),
		categories: group.values
			.map((v, i) => ({
				name: data.categories[i],
				value: v
			}))
			.sort((a, b) => a.value - b.value)
	}));

/*
Scale
--------------
**************/
const xScale = new Plottable.Scales.Category();
const yScale = new Plottable.Scales.Linear();
const colors = ['#820933', '#D84797', '#D2FDFF', '#3ABEFF', '#26FFE6'];
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
					.append('text')
					.text(`${entity.datum.label}, ${entity.datum.value}`)
					.attr('x', baseline.x2.baseVal.value / 2)
					.attr('y', rect.y.baseVal.value + rect.height.baseVal.value / 2)
					.attr('text-anchor', 'middle')
					.attr('fill', '#fff');
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
		.attr('fill', colors[index])
		.x(d => d.x, xScale)
		.y(d => d.y, new Plottable.Scales.Linear())
		.labelsEnabled(true)
		.addDataset(new Plottable.Dataset([{
			x: 1,
			y: 1,
			label: group.name,
			value: group.sum
		}]));

	const plotCategories = new StackedBar()
		.attr('style', 'width: 100%')
		.attr('fill', colors[index])
		.attr('stroke', '#fff')
		.attr('stroke-width', 1)
		.labelsEnabled(true)
		.x(d => d.x, xScale)
		.y(d => d.y, yScale);

	group.categories.forEach((category, i) => {
		plotCategories.addDataset(new Plottable.Dataset([{
			x: 1,
			y: category.value / group.sum,
			label: category.name,
			value: category.value,
			i
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
