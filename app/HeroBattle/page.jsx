import React from "react";
import HeroComparisonChart from "../components/HeroComparisonChart";

const page = () => {
  return (
    <div>
      <h1>Home</h1>
      <section>
        <h3 className="text-center mb-8">
          Pick two heros to compare, and see how they stack!
        </h3>
        <HeroComparisonChart />
      </section>
    </div>
  );
};

export default page;
