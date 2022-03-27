// @TODO: YOUR CODE HERE!\
// Define SVG area dimensions

var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var Margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var width = svgWidth - Margin.left - Margin.right;
var height = svgHeight - Margin.top - Margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${Margin.left}, ${Margin.top})`);


var file = String.raw`\data\data.csv`

d3.csv(file).then(function(statedata){
    console.log(statedata)
    
    statedata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(statedata, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(statedata, d => d.healthcare)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
      
      var circlesGroup = chartGroup.selectAll("circle")
      .data(statedata)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "#69b3a2")
      .attr("opacity", "1");
      
      var Labels = chartGroup.selectAll(null).data(statedata).enter().append("text");

      Labels
        .attr("x", function(d) {
          return xLinearScale(d.poverty);
        })
        .attr("y", function(d) {
          return yLinearScale(d.healthcare);
        })
        .text(function(d) {
          return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");
      
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - Margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + Margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});

