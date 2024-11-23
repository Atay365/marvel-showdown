import Image from "next/image";
import HeroScatterPlot from "./components/HeroScatterplot";
import HeroRadarChart from "./components/HeroRadarChart";
import AlignmentBarChart from "./components/AlignmentBarChart";
import StatsHeatmap from "./components/StatsHeatmap";

export default function Home() {
  return (
    <div className="flex justify-center pt-12 w-full">
      <section className="w-full flex items-center flex-col">
        <div>
          <h1 className="h-12 text-5xl mb-4">Dashboard</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 w-3/4">
          <div className="h-80 flex justify-center items-center border-2 border-white  border-opacity-15 rounded-md bg-black bg-opacity-75">
            <HeroScatterPlot />
          </div>
          <div className="h-80 justify-center items-center border-2 border-white border-opacity-15 rounded-md bg-black bg-opacity-75">
            <HeroRadarChart />
          </div>
          <div className="h-80 justify-center items-center border-2 border-white border-opacity-15 rounded-md bg-black bg-opacity-75">
            <AlignmentBarChart />
          </div>
          <div className="h-80 justify-center items-center border-2 border-white border-opacity-15 rounded-md bg-black bg-opacity-75">
            <StatsHeatmap />
          </div>
        </div>
      </section>
    </div>
  );
}
