// @TODO: YOUR CODE HERE!
// setting svg width and hight
var svgWidth = 900;
var svgHeight = 600;

// setting margin
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

// setting width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating and appending the svg object
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


var csv = "assets/data/data.csv"

// using d3 to select the data
d3.csv(csv).then(successHandle, errorHandle);

// function for error handling
function errorHandle(error) {
  throw err;
}

// states data function
function successHandle(statesData) {


  statesData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

// setting x and y Linear scales in correspondence with the poverty and obesity data
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);

// creating axis variables from linear scale variables
  var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);

   
  // x axis label
  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width - 190)
  .attr("y", height + 90)
  .text("poverty rate");
// y axis label
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", height - 450)
    .attr("x", -300)
    .attr("transform", "rotate(-90)")
    .text("obesity %");

// append bottom axis for chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
// append left axis for chart
  chartGroup.append("g")
    .call(leftAxis);

 // create circles from states data
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")

  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

//  create tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });

  chartGroup.call(toolTip);

// create mouseover function
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })

    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

 
}