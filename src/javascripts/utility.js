import d3 from 'd3';
/**
 * Global chart settings
 */
export default function cleanUp(chartId, isHorizontal = false, hasGrid = true, showLabels = true) {
	// grid lines configurations
	const chart = d3.select(chartId);
	const axis = isHorizontal ? 'x' : 'y';
	chart.select(`.${axis}-gridlines`)
		.selectAll('line')
		.attr('stroke-dasharray', '1 5');

	// YAxis
	const yaxisElm = chart.select(`.${axis}-axis`);
	yaxisElm.select('.tick-mark-container').attr('style', 'visibility:hidden');

	yaxisElm.select('.baseline').attr('style', 'visibility:hidden');

	const trans = chart.select('.tick-label-container').attr('transform');
	// console.log(trans);
	const point = trans.replace(/[\()a-z]/g, '').split(',');
	if (point[0] > 0) {
		chart.select('.tick-label-container')
					.attr('transform', `translate(${point[0] - 10}, ${point[1]})`);
	}
	// show hidden tick Labels
	if (showLabels) {
		chart.selectAll('.tick-label')
		.attr('style', 'visibility:visible');
	}
	// hide xScale tick marks
	chart.selectAll('.tick-mark')
		.attr('style', 'visibility:hidden');
	if (hasGrid) {
		chart.select(`.${axis}-gridlines line`)[0][0]
				.parentNode.lastChild.setAttribute('style', 'visibility:hidden');
	}
	chart.select(`.${axis}-axis .tick-label`)[0][0]
			.parentNode.lastChild.setAttribute('style', 'visibility:hidden');
}
