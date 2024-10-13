import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import { useNavigate } from "react-router-dom";
import Auth from "../../utils/auth";

const LoginForm = () => {
  const [formState, setFormState] = useState({ login: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="login"
          className="block text-sm font-medium text-white mb-1 text-left"
        >
          Username or Email
        </label>
        <input
          type="text"
          id="login"
          name="login"
          className="w-full px-3 py-2 rounded-md shadow-sm bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 focus:border-blue-400"
          placeholder="Enter your username or email"
          value={formState.login}
          onChange={handleChange}
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
          value={formState.password}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-full text-white bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all"
      >
        Login
      </button>
      {error && <div className="text-red-500">Login failed!</div>}
    </form>
  );
};

export default LoginForm;
