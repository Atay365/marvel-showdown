"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const calculateCorrelation = (x, y) => {
  const n = x.length;
  const meanX = d3.mean(x);
  const meanY = d3.mean(y);
  const covariance =
    d3.sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY))) / n;
  const stdDevX = Math.sqrt(d3.sum(x.map((xi) => (xi - meanX) ** 2)) / n);
  const stdDevY = Math.sqrt(d3.sum(y.map((yi) => (yi - meanY) ** 2)) / n);

  return covariance / (stdDevX * stdDevY);
};

const StatsHeatmap = () => {
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

        // Process the data to include only stats
        const processedData = data.map((hero) => ({
          strength: hero.Strength,
          speed: hero.Speed,
          durability: hero.Durability,
          power: hero.Power,
          combat: hero.Combat,
          intelligence: hero.Intelligence,
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

      const width = 280;
      const height = 250;
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };

      // List of stats
      const stats = [
        "strength",
        "speed",
        "durability",
        "power",
        "combat",
        "intelligence",
      ];

      // Compute correlation matrix
      const correlationMatrix = [];
      stats.forEach((stat1) => {
        stats.forEach((stat2) => {
          const values1 = heroData.map((d) => d[stat1]);
          const values2 = heroData.map((d) => d[stat2]);
          const correlation = calculateCorrelation(values1, values2);
          correlationMatrix.push({ stat1, stat2, correlation });
        });
      });

      // Set up scales
      const xScale = d3
        .scaleBand()
        .domain(stats)
        .range([0, width])
        .padding(0.05);
      const yScale = d3
        .scaleBand()
        .domain(stats)
        .range([0, height])
        .padding(0.05);
      const colorScale = d3
        .scaleSequential(d3.interpolateRdYlBu) // Red to Yellow to Blue
        .domain([-1, 1]); // Correlation range

      // Create SVG container
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const g = svg.select("g");

      // Draw cells
      g.selectAll("rect")
        .data(correlationMatrix)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.stat1))
        .attr("y", (d) => yScale(d.stat2))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(d.correlation));

      // Add labels
      g.selectAll(".x-label")
        .data(stats)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "white")
        .text((d) => d);

      g.selectAll(".y-label")
        .data(stats)
        .enter()
        .append("text")
        .attr("x", -10)
        .attr("y", (d) => yScale(d) + yScale.bandwidth() / 2)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .style("fill", "white")
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
        .text("Hero Stats Correlation Heatmap");
    }
  }, [heroData]);

  return (
    <div className="flex justify-center items-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StatsHeatmap;
