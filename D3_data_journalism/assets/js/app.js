// @TODO: YOUR CODE HERE!
//Chart Params 
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import csv
d3.csv("assets/data/data.csv").then(function(healthData) {
    console.log(healthData);

    //create function to parse data
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create scaling functions
    var xLinearScale = d3.scaleLinear()
        // .domain([0, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        // .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    //create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin = d3.min(healthData, function(data) {
        return data.poverty;
    });

    var xMax = d3.max(healthData, function(data) {
        return data.poverty;
    });

    var yMin = d3.min(healthData, function(data) {
        return data.healthcare;
    });

    var yMax = d3.max(healthData, function(data) {
        return data.healthcare;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    //add x axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    //add y axis
    chartGroup.append("g")
        .call(leftAxis);

    //create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("opacity", ".5");

    //initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
        return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });

    //create tool tip in chart
    chartGroup.call(toolTip);

    //create event listeners to display and hide tool tip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    
    //create axis labels 
    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty +1.3);
      })
      .attr("y", function(data) {
          return yLinearScale(data.healthcare +.1);
      })
      .text(function(data) {
          return data.abbr
      });
    


    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");

      chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
})
  