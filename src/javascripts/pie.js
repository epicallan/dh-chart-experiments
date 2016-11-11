import Plottable from 'plottable';

const scale = new Plottable.Scales.Linear();

const colorScale = new Plottable.Scales.InterpolatedColor();

colorScale.range(['#BDCEF0', '#5279C7']);

const data = [{
	val: 1
}, {
	val: 2
}, {
	val: 3
}, {
	val: 4
}, {
	val: 5
}, {
	val: 6
}];

export default (container) =>
new Plottable.Plots.Pie()
	.addDataset(new Plottable.Dataset(data))
	.sectorValue(d => d.val, scale)
	.labelsEnabled(true)
	.innerRadius(60)
	.attr('fill', d => d.val, colorScale)
	.renderTo(container);
