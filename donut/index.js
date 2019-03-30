function donutChart() {
    var width,
        height,
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        colour = d3.scaleOrdinal(d3.schemeCategory20c),
        variable,
        category,
        padAngle,
        floatFormat = d3.format('.4r'),
        cornerRadius,
        percentFormat = d3.format(',.2%');

    function chart(selection){
        selection.each(function(data) {



            var radius = Math.min(width, height) / 2;


            var pie = d3.pie()
                .value(function(d) { return floatFormat(d[variable]); })
                .sort(null);

            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);


            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
            var svg = selection.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
              .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName');
            svg.append('g').attr('class', 'lines');

            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
              .enter().append('path')
                .attr('fill', function(d) { return colour(d.data[category]); })
                .attr('d', arc);

            var label = svg.select('.labelName').selectAll('text')
                .data(pie)
              .enter().append('text')
                .attr('dy', '.35em')
                .html(function(d) {

                    return d.data[category] + ': <tspan>' + d.data[variable] + '</tspan>';
                })
                .attr('transform', function(d) {


                    var pos = outerArc.centroid(d);


                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function(d) {

                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
                });

            var polyline = svg.select('.lines')
                .selectAll('polyline')
                .data(pie)
              .enter().append('polyline')
                .attr('points', function(d) {


                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                });

            d3.selectAll('.labelName text, .slices path').call(toolTip);

            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }


            function toolTip(selection) {


                selection.on('mouseenter', function (data) {

                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15)
                        .html(toolTipHTML(data))
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle');

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.55)
                        .style('fill', colour(data.data[category]))
                        .style('fill-opacity', 0.35);

                });


                selection.on('mouseout', function () {
                    d3.selectAll('.toolCircle').remove();
                });
            }


            function toolTipHTML(data) {

                var tip = '',
                    i   = 0;

                for (var key in data.data) {


                    var value = (!isNaN(parseFloat(data.data[key]))) ? data.data[key] : data.data[key];


                    if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }

                return tip;
            }

        });
    }


    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colour = function(value) {
        if (!arguments.length) return colour;
        colour = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}
