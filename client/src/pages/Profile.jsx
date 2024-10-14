import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_ME } from "../../src/utils/queries";
import { UPDATE_USER } from "../../src/utils/mutations";
import Auth from "../../src/utils/auth";

const Profile = () => {
  const { loading, data } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);

  const userData = data?.me || {};

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!loading && userData) {
      setFormState({
        username: userData.username || "",
        email: userData.email || "",
        password: "",
      });
    }
  }, [loading, userData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await updateUser({
        variables: { ...formState },
      });

      // Log the user in with the new token to refresh the session
      if (data.updateUser.token) {
        Auth.login(data.updateUser.token); // Refresh the token after profile update
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      if (err.message.includes("Username already in use")) {
        setMessage({ text: "Username already in use", type: "error" });
      } else if (err.message.includes("Email already in use")) {
        setMessage({ text: "Email already in use", type: "error" });
      } else {
        setMessage({
          text: "An error occurred while updating your profile.",
          type: "error",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Update Profile
        </h1>

        {message.text && (
          <div
            className={`text-lg mb-4 p-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-lg mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
              value={formState.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-lg mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
              value={formState.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-lg mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
