"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const HeroScatterPlot = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [heroData, setHeroData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [alignment, setAlignment] = useState("good"); // Default filter
  const [yAxisAttribute, setYAxisAttribute] = useState("intelligence"); // Default Y-axis

  useEffect(() => {
    // Fetch hero data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/getData?collection=stats"
        );
        const data = await response.json();

        // Filter out heroes with Total power of 0 and process alignment
        const processedData = data
          .filter((hero) => hero.Total > 10) // Remove zero Total power heroes
          .map((hero) => ({
            name: hero.Name,
            totalPower: hero.Total,
            intelligence: hero.Intelligence,
            strength: hero.Strength,
            speed: hero.Speed,
            durability: hero.Durability,
            power: hero.Power,
            combat: hero.Combat,
            alignment: hero.Alignment
              ? hero.Alignment.toLowerCase()
              : "neutral", // Default to "neutral" if missing
          }));

        setHeroData(processedData);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on the selected alignment
    setFilteredData(heroData.filter((hero) => hero.alignment === alignment));
  }, [heroData, alignment]);

  useEffect(() => {
    // Set up the scatterplot
    if (filteredData.length > 0) {
      const svg = d3.select(svgRef.current);
      const tooltip = d3.select(tooltipRef.current);

      svg.selectAll("*").remove(); // Clear previous renders

      const width = 300;
      const height = 200;
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };

      // Set up the SVG element
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create scales
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d.totalPower) || 1]) // Default to 1 if no data
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d[yAxisAttribute]) || 1])
        .range([height, 0]); // Flip Y-axis for proper orientation

      // Create axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .attr("fill", "white")
        .style("text-anchor", "middle")
        .text("Total Power");

      g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("x", -margin.left / 2)
        .attr("y", -10)
        .attr("fill", "")
        .style("text-anchor", "middle")
        .text(yAxisAttribute.charAt(0).toUpperCase() + yAxisAttribute.slice(1)); // Capitalize label

      // Create scatterplot points
      g.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.totalPower))
        .attr("cy", (d) => yScale(d[yAxisAttribute]))
        .attr("r", 5)
        .attr("fill", alignment === "good" ? "blue" : "red") // Color based on alignment
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`)
            .html(
              `<strong>${d.name}</strong><br>${yAxisAttribute}: ${d[yAxisAttribute]}`
            );
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
    }
  }, [filteredData, alignment, yAxisAttribute]);

  return (
    <div>
      <div className="flex gap-2 text-xs ml-4">
        <button
          onClick={() => setAlignment("good")}
          className="border px-1 rounded-md"
        >
          Good
        </button>
        <button
          onClick={() => setAlignment("bad")}
          className="border px-1 rounded-md"
        >
          Bad
        </button>
      </div>
      <div className="flex justify-center">
        <label htmlFor="y-axis-select" className="text-xs">
          Select Y-axis:
        </label>
        <select
          id="y-axis-select"
          className="bg-transparent text-xs"
          value={yAxisAttribute}
          onChange={(e) => setYAxisAttribute(e.target.value)}
        >
          <option value="intelligence">Intelligence</option>
          <option value="strength">Strength</option>
          <option value="speed">Speed</option>
          <option value="durability">Durability</option>
          <option value="power">Power</option>
          <option value="combat">Combat</option>
        </select>
      </div>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "5px",
          opacity: 90,
          pointerEvents: "none",
          color: "black",
          fontSize: "10px",
        }}
      ></div>
    </div>
  );
};

export default HeroScatterPlot;
