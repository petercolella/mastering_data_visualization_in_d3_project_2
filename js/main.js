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

const year = g
  .append("text")
  .attr("class", "year")
  .attr("x", WIDTH)
  .attr("y", HEIGHT - 10)
  .attr("font-size", "40px")
  .attr("text-anchor", "end");

const x = d3.scaleLog();
const y = d3.scaleLinear();
const r = d3.scaleLinear();
const color = d3.scaleOrdinal(d3.schemePastel1);

const xAxisGroup = g.append("g").attr("class", "x axis").attr("transform", `translate(0, ${HEIGHT})`);
const yAxisGroup = g.append("g").attr("class", "y axis");

let i = 0;

d3.json("data/data.json").then(function (data) {
  const filteredData = data.map((d) => {
    const obj = d;
    return {
      ...obj,
      countries: obj.countries.filter((c) => c.income && c.life_exp && c.population),
    };
  });

  d3.interval(() => {
    i++;
    if (i === filteredData.length) i = 0;
    update(filteredData[i]);
  }, 100);

  update(filteredData[i]);
});

function update(data) {
  year.text(data.year);
  const t = d3.transition().duration(100);

  x.domain([100, 150000]).range([0, WIDTH]);
  y.domain([0, 90]).range([HEIGHT, 0]);
  r.domain([0, d3.max(data.countries, (d) => Math.sqrt(d.population / Math.PI))]).range([5, 25]);
  color.domain(Array.from(new Set(data.countries.map((c) => c.continent))).sort());

  const xAxisCall = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d3.format("$"));
  xAxisGroup.transition(t).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  yAxisGroup.transition(t).call(yAxisCall);

  const circles = g.selectAll("circle").data(data.countries, (d) => d.country);

  circles.exit().remove();

  circles
    .enter()
    .append("circle")
    .merge(circles)
    .transition(t)
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => r(Math.sqrt(d.population / Math.PI)))
    .attr("fill", (d) => color(d.continent));
}
