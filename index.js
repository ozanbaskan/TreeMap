"use strict";

const projectName = "Tree Map";
const colors = [
  "#FF6100",
  "#AAFF00",
  "#49FF00",
  "#00FFF7",
  "#D500FF",
  "#FF0055",
  "#F3FF00",
  "#002BFF",
  "#B900FF",
  "#FF0000",
];
const holder = d3
  .select(".holder")
  .append("svg")
  .attr("width", 800)
  .attr("height", 800);

const tooltip = d3
  .select(".holder")
  .append("div")
  .attr("id", "tooltip")
  .attr("width", 60)
  .attr("height", 120)
  .style("visibility", "hidden");

const dataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

let treeData;
const drawTreeMap = () => {
  let hierarchy = d3
    .hierarchy(treeData, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });
  const createTreeMap = d3.treemap().size([800, 800]);
  const categories = hierarchy.leaves().map((item) => item.data.category);
  const uniqueCategories = categories.filter(function (item, pos) {
    return categories.indexOf(item) == pos;
  });
  createTreeMap(hierarchy);
  let rects = holder
    .selectAll("g")
    .data(hierarchy.leaves())
    .enter()
    .append("g")
    .attr("id", function (d, i) {
      return d;
    })
    .attr("transform", function (d, i) {
      return "translate(" + d.x0 + "," + d.y0 + ")";
    })
    .attr("width", function (d, i) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d, i) {
      return d.y1 - d.y0;
    })
    .on("mousemove", function (event, d) {
      const i = event.currentTarget.id;
      tooltip.transition().duration(10).style("visibility", "visible");
      tooltip
        .html(
          "<strong>Category:</strong> " +
            d.data.category +
            "</br>" +
            "<strong>Name:</strong> " +
            d.data.name +
            "</br>" +
            "<strong>Value:</strong> " +
            d.data.value
              .replace(/([0-9]{6}$)/, ".$1")
              .replace(/^[.]/, "")
              .replace(/([0-9]*[.][0-9]{2})[0-9]*/, "$1")
        )
        .style("margin-left", event.pageX + 5 + "px")
        .style("margin-top", event.pageY + 5 + "px")
        .attr("data-value", d.data.value);
    })
    .on("mouseout", function (event, d) {
      const i = event.currentTarget.id;
      tooltip.transition().duration(10).style("visibility", "hidden");
    });

  rects
    .append("rect")
    .attr("class", "tile")
    .attr("fill", function (d, i) {
      for (let i = 0; i < uniqueCategories.length; i++) {
        if (uniqueCategories[i] === d.data.category) {
          return colors[i % 10];
        }
      }
    })
    .attr("data-name", function (d, i) {
      return d.data.name;
    })
    .attr("data-category", function (d, i) {
      return d.data.category;
    })
    .attr("data-value", function (d, i) {
      return d.data.value;
    })
    .attr("width", function (d, i) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d, i) {
      return d.y1 - d.y0;
    })
    .style("stroke", "black")
    .style("stroke-width", 0.5);

  rects
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data(function (d) {
      return d.data.name.split(" ");
    })
    .enter()
    .append("tspan")
    .attr("x", 1)
    .attr("y", function (d, i) {
      return 13 + i * 10;
    })
    .text(function (d) {
      return d;
    })
    .style("font-size", function (d, i) {
      const fontSize = (d.x1 - d.x0 + d.y1 - d.y0) / 30;
      if (fontSize <= 10) {
        return 10;
      } else if (fontSize >= 16) {
        return 16;
      }
      return fontSize;
    });
  const legendContainer = d3
    .select(".holder")
    .append("svg")
    .attr("width", 800)
    .attr("height", 130)
    .attr("id", "legend");
  legendContainer
    .selectAll("rect")
    .data(uniqueCategories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .style("fill", function (d, i) {
      return colors[i % 10];
    })
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", function (d, i) {
      return 10 + (i % 3) * 300;
    })
    .attr("y", function (d, i) {
      return 10 + Math.floor(i / 3) * 20;
    });
  legendContainer
    .selectAll("text")
    .data(uniqueCategories)
    .enter()
    .append("text")
    .text(function (d, i) {
      return d;
    })
    .attr("x", function (d, i) {
      return 25 + (i % 3) * 300;
    })
    .attr("y", function (d, i) {
      return 20 + Math.floor(i / 3) * 20;
    });
  console.log(hierarchy.leaves());
  console.log(uniqueCategories);
};

const req = new XMLHttpRequest();
req.open("GET", dataUrl, true);
req.send();
req.onload = function () {
  const data = JSON.parse(req.responseText);
  console.log(data);
  treeData = data;
  drawTreeMap();
};
