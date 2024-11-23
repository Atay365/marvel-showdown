import Image from "next/image";
import HeroScatterPlot from "./components/HeroScatterplot";
import HeroRadarChart from "./components/HeroRadarChart";
import AlignmentBarChart from "./components/AlignmentBarChart";
import StatsHeatmap from "./components/StatsHeatmap";

export default function Home() {
  return (
    <div className="flex justify-center mt-12 w-full">
      <section className="w-full flex items-center flex-col">
        <div>
          <h1 className="h-12 text-xl">Dashboard</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-80 w-96 flex justify-center items-center border-2 border-white rounded-md">
            <HeroScatterPlot />
          </div>
          <div className="h-80 w-96 justify-center items-center border-2 border-white rounded-md">
            <HeroRadarChart />
          </div>
          <div className="h-80 w-96 justify-center items-center border-2 border-white rounded-md">
            <AlignmentBarChart />
          </div>
          <div className="h-80 w-96 justify-center items-center border-2 border-white rounded-md">
            <StatsHeatmap />
          </div>
        </div>
      </section>
    </div>
  );
}
