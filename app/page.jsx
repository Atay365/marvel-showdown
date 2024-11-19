import Image from "next/image";
import HeroScatterPlot from "./components/HeroScatterplot";

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
          <div className="h-80 w-96 bg-red-600">Chart 2</div>
          <div className="h-80 w-96 bg-red-600">Chart 3</div>
          <div className="h-80 w-96 bg-red-600">Chart 4</div>
        </div>
      </section>
    </div>
  );
}
