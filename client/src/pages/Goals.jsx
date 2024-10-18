import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";
import Layout from '../components/Layout';

const Goals = () => {
  const { loading, data } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [carbonData, setCarbonData] = useState(null);

  useEffect(() => {
    if (data?.me) {
      setGoals(data.me.goals || []);
      setCarbonData(data.me.carbonData || { carbon_kg: 0 });
    }
  }, [data]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    setNewGoal("");

    try {
      await updateUser({
        variables: { goals: updatedGoals },
      });
    } catch (err) {
      console.error("Error updating goals:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Layout> {/* Wrapping content in Layout */}
      <div className="bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen flex items-center justify-center p-8">
        <div className="relative min-h-screen">
          <div className="container mx-auto px-4 py-8 mt-16 relative z-10">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                Your Sustainability Goals
              </h1>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Current Carbon Footprint
                </h2>
                <p className="text-xl text-blue-600 font-medium">
                  {carbonData ? `${carbonData.carbon_kg} kg CO2e` : "0 kg CO2e"}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Your Goals
                </h2>
                {goals.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {goals.map((goal, index) => (
                      <li key={index} className="text-gray-600">
                        {goal}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No goals set yet. Add your first goal below!
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Add New Goal
                </h2>
                <form onSubmit={handleAddGoal} className="flex items-center">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Enter your new goal"
                    className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    Add Goal
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Goals;
