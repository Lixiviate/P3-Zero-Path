import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";

const GOAL_CATEGORIES = {
  FLIGHT: {
    name: "Flight Emissions",
    options: [
      "Reduce flight travel by 20% this year",
      "Choose direct flights when possible",
      "Opt for economy class to reduce per-person emissions",
      "Use video conferencing instead of business travel",
      "Offset flight emissions through verified programs",
      "Plan trips to combine multiple purposes",
      "Choose airlines with newer, more efficient fleets",
      "Travel during off-peak seasons for better flight capacity",
      "Pack lighter to reduce flight weight",
      "Use train travel for short-distance trips instead of flying",
    ],
  },
  VEHICLE: {
    name: "Vehicle Usage",
    options: [
      "Switch to electric/hybrid vehicle",
      "Reduce weekly driving miles by 25%",
      "Start carpooling twice a week",
      "Use public transportation for commuting",
      "Maintain optimal tire pressure for better efficiency",
      "Remove excess weight from vehicle",
      "Combine errands to reduce trips",
      "Work from home when possible",
      "Walk or bike for short distances",
      "Join a car-sharing program",
      "Regular vehicle maintenance for optimal efficiency",
      "Avoid idling vehicle unnecessarily",
    ],
  },
  SHIPPING: {
    name: "Shipping Impact",
    options: [
      "Consolidate shipments to reduce frequency",
      "Choose ground shipping over air freight",
      "Optimize packaging to reduce weight",
      "Use local suppliers when possible",
      "Select eco-friendly packaging materials",
      "Participate in packaging recycling programs",
      "Choose carriers with green initiatives",
      "Plan ahead to avoid rush shipping",
      "Bundle orders to reduce separate deliveries",
      "Support companies with sustainable shipping practices",
      "Use reusable shipping containers",
      "Minimize return shipments through careful purchasing",
    ],
  },
};
const Goals = () => {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("FLIGHT");
  const [customGoal, setCustomGoal] = useState("");
  const [accomplishedGoals, setAccomplishedGoals] = useState([]);

  useEffect(() => {
    if (data?.me) {
      setGoals(data.me.goals || []);
      setAccomplishedGoals(data.me.accomplishedGoals || []);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [goals.length, accomplishedGoals.length, refetch]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const goalToAdd = customGoal || newGoal;
    if (!goalToAdd.trim()) return;

    try {
      const categoryName = GOAL_CATEGORIES[selectedCategory].name;
      const goalWithCategory = `[${categoryName}] ${goalToAdd}`;
      const updatedGoals = [...goals, goalWithCategory];

      // Add goals without accomplishedGoals for new goals
      const { data: updateData } = await updateUser({
        variables: {
          goals: updatedGoals,
        },
      });

      if (updateData?.updateUser?.success) {
        setGoals(updateData.updateUser.user.goals || []);
        setNewGoal("");
        setCustomGoal("");
        await refetch();
      }
    } catch (err) {
      console.error("Error updating goals:", err);
    }
  };

  const handleAccomplishGoal = async (goalToAccomplish) => {
    try {
      // Create updated goals array
      const updatedGoals = goals.filter((goal) => goal !== goalToAccomplish);

      // Format the accomplished goal properly
      const newAccomplishedGoal = {
        goal: goalToAccomplish,
        accomplishedAt: new Date().toISOString(),
      };

      // Make sure all accomplishedGoals have the correct format
      const formattedAccomplishedGoals = [
        ...accomplishedGoals,
        newAccomplishedGoal,
      ].map((goal) => ({
        goal: goal.goal,
        accomplishedAt: goal.accomplishedAt,
      }));

      // Update database
      const { data: updateData } = await updateUser({
        variables: {
          goals: updatedGoals,
          accomplishedGoals: formattedAccomplishedGoals,
        },
      });

      if (updateData?.updateUser?.success) {
        setGoals(updateData.updateUser.user.goals || []);
        setAccomplishedGoals(
          updateData.updateUser.user.accomplishedGoals || []
        );
        await refetch();
      }
    } catch (err) {
      console.error("Error updating goals:", err);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setNewGoal("");
    setCustomGoal("");
  };

  const handlePresetGoalChange = (e) => {
    setNewGoal(e.target.value);
    setCustomGoal("");
  };

  return (
    <div className="bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen flex items-center justify-center p-8">
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8 mt-16 relative z-10">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
              Carbon Reduction Goals
            </h1>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Your Active Goals
              </h2>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {Object.values(GOAL_CATEGORIES).map((category) => {
                    const categoryGoals = goals.filter((goal) =>
                      goal.includes(`[${category.name}]`)
                    );
                    if (categoryGoals.length === 0) return null;

                    return (
                      <div
                        key={category.name}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h3 className="font-medium text-gray-700 mb-2">
                          {category.name}
                        </h3>
                        <ul className="space-y-2">
                          {categoryGoals.map((goal, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between p-2 rounded gap-4"
                            >
                              <span className="text-gray-600">
                                {goal.replace(`[${category.name}]`, "").trim()}
                              </span>
                              <button
                                onClick={() => handleAccomplishGoal(goal)}
                                className="px-4 py-1.5 bg-teal-300 text-white text-sm gap-4 rounded-full hover:bg-teal-400 transition-all ml-4 whitespace-nowrap"
                              >
                                Mark Complete
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No active goals yet. Add your first goal below!
                </p>
              )}
            </div>

            {accomplishedGoals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Accomplished Goals
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {accomplishedGoals.map((accomplishedGoal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-600 flex-grow">
                        {accomplishedGoal.goal.split("] ")[1]}
                      </span>
                      <span className="text-sm text-gray-500 pl-4 whitespace-nowrap">
                        {new Date(
                          accomplishedGoal.accomplishedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Add New Goal
              </h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select a Preset Goal
                  </label>
                  <select
                    value={newGoal}
                    onChange={handlePresetGoalChange}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">
                      Choose a preset goal or enter custom below
                    </option>
                    {GOAL_CATEGORIES[selectedCategory].options.map(
                      (option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Enter Custom Goal
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Enter your custom goal"
                      className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="submit"
                      disabled={!newGoal && !customGoal.trim()}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      Add Goal
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
