/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const MARGIN = { LEFT: 70, RIGHT: 20, TOP: 10, BOTTOM: 40 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 38)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

g.append("text")
  .attr("class", "y axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -HEIGHT / 2)
  .attr("y", -48)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Life Expectancy (Years)");

d3.json("data/data.json").then(function (data) {
  console.log(data);
  const filteredData = data.map((d) => {
    const obj = d;
    return {
      ...obj,
      countries: obj.countries.filter((c) => c.income && c.life_exp && c.population),
    };
  });
  console.log(filteredData[0].countries);

  const x = d3.scaleLog().domain([100, 150000]).range([0, WIDTH]);

  const y = d3.scaleLinear().domain([0, 90]).range([0, HEIGHT]);

  const xAxisCall = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d3.format("$"));
  g.append("g").attr("class", "x axis").attr("transform", `translate(0, ${HEIGHT})`).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  g.append("g").attr("class", "y axis").call(yAxisCall);

  g.selectAll("circle")
    .data(filteredData[0].countries)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    // .attr("r", (d) => Math.sqrt(d.population / Math.PI));
    .attr("r", 4);
});
