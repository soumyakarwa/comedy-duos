// util.js
import * as Constants from "./Constants.js";
import * as d3 from "d3";

export function createThumbPin(svg, pos, color) {
  const ellipse = svg
    .append("ellipse")
    // .attr("class", "thumb-pin")
    .attr("rx", Constants.ellipseSize)
    .attr("ry", Constants.ellipseSize)
    .attr("cx", pos[0])
    .attr("cy", pos[1])
    .attr("fill", color)
    .attr("opacity", 0);

  ellipse.transition().duration(Constants.transitionTime).attr("opacity", 1);

  return ellipse;
}

export function createLine(svg, pos1, pos2, delay) {
  const line = svg
    .append("line")
    // .attr("class", "line")
    .style("stroke", Constants.yellowColor)
    .style("stroke-width", 2)
    .style("opacity", 1)
    .attr("x1", pos1[0])
    .attr("y1", pos1[1])
    .attr("x2", pos1[0])
    .attr("y2", pos1[1]);

  line
    .transition()
    .delay(delay)
    .duration(Constants.transitionTime * 2)
    .ease(d3.easeSinInOut)
    .attr("x2", pos2[0])
    .attr("y2", pos2[1]);

  return line;
}

export function addOrUpdateLine(svg, lineData, startPos, endPos) {
  if (!lineData.line) {
    lineData.line = createLine(svg, startPos, endPos, 0);
  } else {
    lineData.line
      .transition()
      .duration(Constants.transitionTime)
      .attr("x1", startPos[0])
      .attr("y1", startPos[1])
      .attr("x2", endPos[0])
      .attr("y2", endPos[1]);
  }
  lineData.startingPos = startPos;
  lineData.endingPos = endPos;
}

export function addOrUpdateThumbPin(
  svg,
  thumbPin,
  color = Constants.yellowColor
) {
  if (!thumbPin.ellipse) {
    thumbPin.ellipse = createThumbPin(svg, thumbPin.pos, color);
  } else {
    // updateThumbPinPosition(caseImageData.topPins.ellipse, caseImageData.topPins.pos);
    thumbPin.ellipse
      .transition()
      .duration(Constants.transitionTime)
      .attr("cx", thumbPin.pos[0])
      .attr("cy", thumbPin.pos[1]);
  }
}

export function setSvgDimensions(id, svg) {
  const container = document.getElementById(id);
  let width = container.clientWidth;
  let height = container.clientHeight;

  svg.attr("width", width).attr("height", height);

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  return [width, height];
}

export function freezeSectionScroll(lastScrollTop) {
  let sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const currentScrollTop = document.documentElement.scrollTop;
        if (entry.isIntersecting && currentScrollTop > lastScrollTop) {
          console.log("hidden");
          document.body.style.overflow = "hidden";
        } else if (!entry.isIntersecting || currentScrollTop <= lastScrollTop) {
          document.body.style.overflow = "auto";
        }

        // if (
        //   entry.isIntersecting &&
        //   entry.intersectionRatio >= 0.5 &&
        //   index !== sectionTexts.length - 1
        // ) {
        //   console.log(entry.isIntersecting);
        //   // Scroll the section into full view
        //   entry.target.scrollIntoView({ behavior: "smooth" });

        //   // Freeze the scroll once the section is fully in view
        //   setTimeout(() => {
        //     document.body.style.overflow = "hidden";
        //   }, 500);
        // } else if (!entry.isIntersecting || currentScrollTop <= lastScrollTop) {
        //   document.body.style.overflow = "auto";
        // }

        // lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
      });
    },
    {
      threshold: 0.99,
    }
  );
  return sectionObserver;
}

export function resizeSVGs() {
  // Select all SVG elements you want to resize
  const svgs = document.querySelectorAll("svg");
  svgs.forEach((svg) => {
    const parent = svg.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    // Update the SVG dimensions
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  });
}
