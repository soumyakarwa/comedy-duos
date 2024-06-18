// util.js
import * as Constants from "./Constants.js";
import * as d3 from "d3";

export function createThumbPin(svg, pos) {
  svg
    .append("ellipse")
    .attr("rx", Constants.ellipseSize)
    .attr("ry", Constants.ellipseSize)
    .attr("cx", pos[0])
    .attr("cy", pos[1])
    .attr("fill", Constants.yellowColor)
    .attr("opacity", 0)
    .transition()
    .duration(Constants.transitionTime)
    .attr("opacity", 1);
}

export function createLine(svg, pos1, pos2, delay) {
  svg
    .append("line")
    .style("stroke", Constants.yellowColor)
    .style("stroke-width", 2)
    .style("opacity", 0.5)
    .attr("x1", pos1[0])
    .attr("y1", pos1[1])
    .attr("x2", pos1[0])
    .attr("y2", pos1[1])
    .transition()
    .delay(delay)
    .duration(Constants.transitionTime * 2)
    .ease(d3.easeSinInOut)
    .attr("x2", pos2[0])
    .attr("y2", pos2[1]);
}

export function setSvgDimensions(id, svg) {
  const container = document.getElementById(id);
  let width = container.clientWidth;
  let height = container.clientHeight;

  svg.attr("width", width).attr("height", height);

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  return [width, height];
}
