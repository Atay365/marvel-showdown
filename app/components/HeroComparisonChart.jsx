"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

const HeroComparisonPyramid = () => {
  const svgRef = useRef();
  const [heroData, setHeroData] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([null, null]);

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
          intelligence: hero.Intelligence,
          strength: hero.Strength,
          speed: hero.Speed,
          durability: hero.Durability,
          power: hero.Power,
          combat: hero.Combat,
        }));

        setHeroData(processedData);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedHeroes.every((hero) => hero) && heroData.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const width = 600;
      const height = 400;
      const margin = { top: 40, right: 30, bottom: 50, left: 30 };

      // Stats to compare
      const stats = [
        "intelligence",
        "strength",
        "speed",
        "durability",
        "power",
        "combat",
      ];

      // Prepare data for the chart
      const data = stats.map((stat) => ({
        stat,
        hero1: selectedHeroes[0][stat],
        hero2: selectedHeroes[1][stat],
      }));

      // Scales
      const yScale = d3
        .scaleBand()
        .domain(stats)
        .range([0, height])
        .padding(0.2);

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => Math.max(d.hero1, d.hero2))])
        .range([0, width / 2]);

      const colorScale = d3
        .scaleOrdinal()
        .domain(["hero1", "hero2"])
        .range(["blue", "red"]);

      // Create SVG container
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const g = svg.select("g");

      // Central axis
      g.append("line")
        .attr("x1", width / 2)
        .attr("x2", width / 2)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      // Bars for hero 1 (left side)
      g.selectAll(".bar-hero1")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-hero1")
        .attr("x", (d) => width / 2 - xScale(d.hero1)) // Start from the center axis
        .attr("y", (d) => yScale(d.stat))
        .attr("width", 0) // Start with zero width for animation
        .attr("height", yScale.bandwidth())
        .attr("fill", colorScale("hero1"))
        .transition()
        .duration(1000)
        .attr("width", (d) => xScale(d.hero1));

      // Bars for hero 2 (right side)
      g.selectAll(".bar-hero2")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-hero2")
        .attr("x", width / 2) // Start from the center axis
        .attr("y", (d) => yScale(d.stat))
        .attr("width", 0) // Start with zero width for animation
        .attr("height", yScale.bandwidth())
        .attr("fill", colorScale("hero2"))
        .transition()
        .duration(1000)
        .attr("width", (d) => xScale(d.hero2));

      // Add stat labels
      g.selectAll(".stat-label")
        .data(stats)
        .enter()
        .append("text")
        .attr("class", "stat-label")
        .attr("x", width / 2)
        .attr("y", (d) => yScale(d) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .style("font-weight", "bold")
        .text((d) => d);

      // Add title
      svg
        .append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .style("margin-top", "10%")
        .text(
          `Comparison: ${selectedHeroes[0].name} vs ${selectedHeroes[1].name}`
        );
    }
  }, [selectedHeroes, heroData]);

  return (
    <div className="flex flex-col justify-center">
      <div className="flex gap-36 justify-center items-center">
        <Select
          options={heroData.map((hero) => ({ value: hero, label: hero.name }))}
          onChange={(option) =>
            setSelectedHeroes((prev) => [option.value, prev[1]])
          }
          placeholder="Select Hero 1"
          className="text-black w-1/4"
        />
        <Select
          options={heroData.map((hero) => ({ value: hero, label: hero.name }))}
          onChange={(option) =>
            setSelectedHeroes((prev) => [prev[0], option.value])
          }
          placeholder="Select Hero 2"
          className="text-black w-1/4"
        />
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default HeroComparisonPyramid;
