const SignupForm = () => {
  return (
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
          className="w-full px-3 py-2 rounded-md shadow-sm bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 focus:border-blue-400"
          placeholder="Enter your username"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white mb-1 text-left"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 rounded-md shadow-sm bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 focus:border-blue-400"
          placeholder="Enter your email"
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
          className="w-full px-3 py-2 rounded-md shadow-sm bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 focus:border-blue-400"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-full text-white bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
