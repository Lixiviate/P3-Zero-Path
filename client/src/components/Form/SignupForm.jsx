import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import { useNavigate } from "react-router-dom";
import Auth from "../../utils/auth";

const SignupForm = ({ onSuccess }) => {
  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error }] = useMutation(ADD_USER);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSignupFormData({ ...signupFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await addUser({
        variables: { ...signupFormData },
      });

      Auth.login(data.addUser.token);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred during signup.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
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
          value={signupFormData.username}
          onChange={handleInputChange}
          required
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
          value={signupFormData.email}
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
          value={signupFormData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-full text-white bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all"
      >
        Sign Up
      </button>
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </form>
  );
};

export default SignupForm;