import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";

const Profile = () => {
  const { loading, data } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Populate form data after the query returns user data
  useEffect(() => {
    if (data?.me) {
      setFormState({
        username: data.me.username,
        email: data.me.email,
        password: "", // Don't prefill password
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

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

      if (data.updateUser.success) {
        setMessage(data.updateUser.message);
        // Update form with the new values for username/email
        setFormState({
          ...formState,
          password: "", // Reset password field after update
        });
      } else {
        setMessage(data.updateUser.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while updating your profile.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formState.username}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md shadow-sm border border-gray-300"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md shadow-sm border border-gray-300"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            placeholder="Enter a new password"
            className="w-full px-3 py-2 rounded-md shadow-sm border border-gray-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 rounded-full text-white bg-blue-500 hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
