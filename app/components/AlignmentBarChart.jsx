"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const AlignmentBarChart = () => {
  const svgRef = useRef();
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    // Fetch hero data
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/getData?collection=stats"
        );
        const data = await response.json();

        // Process the data
        const processedData = data.map((hero) => ({
          name: hero.Name,
          alignment: hero.Alignment ? hero.Alignment.toLowerCase() : "neutral",
        }));

        setHeroData(processedData);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroData.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const width = 300;
      const height = 200;
      const margin = { top: 40, right: 30, bottom: 50, left: 50 };

      // Count heroes by alignment
      const alignmentCounts = d3.rollup(
        heroData,
        (v) => v.length,
        (d) => d.alignment
      );

      const data = Array.from(alignmentCounts, ([alignment, count]) => ({
        alignment,
        count,
      }));

      // Set up scales
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.alignment))
        .range([0, width])
        .padding(0.3);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .range([height, 0]);

      // Create SVG container
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const g = svg.select("g");

      // Add chart title
      svg
        .append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("Hero Distribution by Alignment");

      // Create X-axis
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-25)")
        .style("text-anchor", "end");

      // Create Y-axis
      g.append("g").call(d3.axisLeft(yScale));

      // Add bars
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.alignment))
        .attr("y", (d) => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.count))
        .attr("fill", (d) => {
          if (d.alignment === "good") return "blue";
          if (d.alignment === "bad") return "red";
          return "gray";
        });
    }
  }, [heroData]);

  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AlignmentBarChart;
