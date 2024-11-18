"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const HeroScatterPlot = () => {
  const svgRef = useRef();
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    // Fetch hero data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/heroes");
        const data = await response.json();
        // Process data to sum the total power of each hero
        const processedData = data.map((hero) => ({
          name: hero.name,
          totalPower:
            hero.intelligence +
            hero.strength +
            hero.speed +
            hero.durability +
            hero.power +
            hero.combat,
        }));
        setHeroData(processedData);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Set up the scatterplot
    if (heroData.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const width = 600;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };

      // Set up the SVG element
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create scales
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(heroData, (d) => d.totalPower)])
        .range([0, width]);

      const yScale = d3
        .scaleBand()
        .domain(heroData.map((d) => d.name))
        .range([0, height])
        .padding(0.1);

      // Create axes
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},${height + margin.top})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Total Power");

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale));

      // Create scatterplot points
      svg
        .append("g")
        .selectAll("circle")
        .data(heroData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.totalPower) + margin.left)
        .attr("cy", (d) => yScale(d.name) + yScale.bandwidth() / 2)
        .attr("r", 5)
        .attr("fill", "blue");
    }
  }, [heroData]);

  return <svg ref={svgRef}></svg>;
};

export default HeroScatterPlot;
