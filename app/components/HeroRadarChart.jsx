"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

const HeroRadarChart = () => {
  const svgRef = useRef();
  const [heroData, setHeroData] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);

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
    if (selectedHero && heroData.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const width = 200;
      const height = 225;
      const radius = Math.min(width, height) / 2;
      const levels = 5; // Number of concentric circles
      const margin = 20;

      // Prepare data for the selected hero
      const heroStats = [
        { axis: "Intelligence", value: selectedHero.intelligence },
        { axis: "Strength", value: selectedHero.strength },
        { axis: "Speed", value: selectedHero.speed },
        { axis: "Durability", value: selectedHero.durability },
        { axis: "Power", value: selectedHero.power },
        { axis: "Combat", value: selectedHero.combat },
      ];

      const maxValue = d3.max(heroStats, (d) => d.value);

      // Determine the dominant stat
      const dominantStat = heroStats.reduce((prev, current) =>
        prev.value > current.value ? prev : current
      ).axis;

      // Map stats to colors
      const colorMap = {
        Intelligence: "blue",
        Strength: "green",
        Speed: "purple",
        Durability: "orange",
        Power: "red",
        Combat: "yellow",
      };

      const radarColor = colorMap[dominantStat] || "gray"; // Fallback to gray if no match

      // Scale for the radius
      const radiusScale = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([0, radius - margin]);

      // Angle for each axis
      const angleSlice = (Math.PI * 2) / heroStats.length;

      // Create SVG container
      svg
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2)
        .append("g")
        .attr(
          "transform",
          `translate(${width / 2 + margin},${height / 2 + margin})`
        );

      const g = svg.select("g");

      // Draw concentric circles
      Array.from({ length: levels }, (_, i) => i + 1).forEach((level) => {
        g.append("circle")
          .attr("r", (radius / levels) * level)
          .attr("fill", "none")
          .attr("stroke", "gray")
          .attr("stroke-dasharray", "3,3");
      });

      // Draw axes
      g.selectAll(".axis")
        .data(heroStats)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr(
          "x2",
          (d, i) =>
            radiusScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "y2",
          (d, i) =>
            radiusScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .attr("stroke", "black");

      // Add axis labels
      g.selectAll(".label")
        .data(heroStats)
        .enter()
        .append("text")
        .attr(
          "x",
          (d, i) =>
            (radiusScale(maxValue) + 10) *
            Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "y",
          (d, i) =>
            (radiusScale(maxValue) + 10) *
            Math.sin(angleSlice * i - Math.PI / 2)
        )
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "white")
        .text((d) => d.axis);

      // Draw radar area
      const radarLine = d3
        .lineRadial()
        .radius((d) => radiusScale(d.value))
        .angle((d, i) => i * angleSlice);

      g.append("path")
        .datum(heroStats)
        .attr("d", radarLine)
        .attr("fill", radarColor)
        .attr("fill-opacity", 0.3)
        .attr("stroke", radarColor)
        .attr("stroke-width", 2);
    }
  }, [selectedHero, heroData]);

  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <div className="w-80">
        {heroData.length > 0 ? (
          <Select
            options={heroData.map((hero) => ({
              value: hero,
              label: hero.name,
            }))}
            onChange={(option) => setSelectedHero(option.value)}
            placeholder="Select or Search a Hero"
            className="text-black"
          />
        ) : (
          <p>Loading...</p> // Or any loading indicator
        )}
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HeroRadarChart;
