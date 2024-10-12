import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";

const LoginForm = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...loginFormData },
      });

      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
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
          value={loginFormData.email}
          onChange={handleInputChange}
          required
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
          value={loginFormData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-full text-white bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all"
      >
        Login
      </button>
      {error && <div className="text-red-500 mt-2">Login failed!</div>}
    </form>
  );
};

export default LoginForm;
