import CarbonCalculator from "../components/CarbonCalculator/CarbonCalculator";

const Tracker = () => {
  return (
    <div
      className="tracker-page min-h-screen"
      style={{ background: "linear-gradient(to bottom, #40E0D0, #4169E1)" }}
    >
      <div className="container mx-auto px-4 py-8 flex justify-center items-center relative z-10 min-h-screen">
        <CarbonCalculator />
      </div>
    </div>
  );
};

export default Tracker;
