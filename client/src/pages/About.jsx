const About = ({ isStandalone }) => {
  return (
    <div
      className={`${
        isStandalone
          ? "bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen flex items-center justify-center p-8"
          : "bg-transparent"
      }`}
    >
      <div className="rounded-xl shadow-xl max-w-2xl w-full text-white p-8 bg-blue-400 bg-opacity-40 backdrop-filter backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-6">About</h2>
        <p className="text-lg mb-4">
          ZeroPath is designed to guide and empower individuals on their journey
          to a more sustainable and eco-friendly lifestyle. Whether you're just
          starting or you're already eco-conscious, ZeroPath is your companion
          on the journey toward a greener future.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
        <p className="text-lg mb-4">
          We believe that everyone can make a difference, no matter how small,
          in reducing their carbon footprint. ZeroPath helps you track your
          efforts to minimize your environmental impact through actionable goals
          and rewarding milestones.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Features</h3>
        <ul className="list-disc list-inside text-lg mb-4">
          <li>
            <strong>Personalized Tracking:</strong> Monitor your carbon
            footprint through various activities.
          </li>
          <li>
            <strong>Interactive Rewards:</strong> Earn rewards as you reduce
            your environmental impact.
          </li>
          <li>
            <strong>Educational Resources:</strong> Learn about sustainability
            and green technologies.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
