import Canvas from "../components/Canvas/Canvas";

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen flex p-8 relative">
      {/* Canvas for bubbles animation */}
      <Canvas enableRipples={false} />
      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
          <p className="text-xl text-teal-100">
            Your journey to sustainability continues
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold mb-4">Track Your Footprint</h3>
            <p className="text-gray-600">
              Monitor your daily carbon emissions and see how your actions
              impact the environment.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold mb-4">Earn Koi Fish</h3>
            <p className="text-gray-600">
              Reduce your carbon footprint and earn unique koi fish to populate
              your virtual pond.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold mb-4">Set New Goals</h3>
            <p className="text-gray-600">
              Challenge yourself with new sustainability goals and track your
              progress over time.
            </p>
          </div>

          {/* Progress Section */}
          <div className="col-span-full bg-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Your Carbon Reduction Progress
            </h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-teal-100">
                <div className="bg-teal-400" style={{ width: "70%" }}></div>
              </div>
              <p className="text-teal-100">
                You’re 70% towards your next reward!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
