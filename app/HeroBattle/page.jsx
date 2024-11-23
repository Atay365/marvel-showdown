import React from "react";
import HeroComparisonChart from "../components/HeroComparisonChart";

const page = () => {
  return (
    <div className="">
      <section className="pt-16">
        <h3 className="text-center mb-8 text-4xl">
          Pick two heros to compare, and see how they stack!
        </h3>
        <HeroComparisonChart />
      </section>
    </div>
  );
};

export default page;
