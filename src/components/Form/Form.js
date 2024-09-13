import React from "react";

const Form = () => {
  return (
    <div className="bg-blue-400 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-white">Welcome</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-white mb-1 text-left"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 border-opacity-50 focus:border-blue-400"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-1 text-left"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 border-opacity-50 focus:border-blue-400"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 mt-8 transition-all duration-300 ease-in-out transform hover:scale-105 glow-effect"
        >
          Begin Your Journey
        </button>
      </form>
    </div>
  );
};

export default Form;