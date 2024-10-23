import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { UPDATE_USER, VERIFY_CREDENTIALS } from "../utils/mutations";
import Auth from "../utils/auth";

const Profile = () => {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);
  const [verifyCredentials] = useMutation(VERIFY_CREDENTIALS);

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    profilePhoto: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!loading && data?.me) {
      const userData = {
        username: data.me.username || "",
        email: data.me.email || "",
        profilePhoto: data.me.profilePhoto || "",
      };
      setFormState((prevState) => ({
        ...prevState,
        ...userData,
        password: "",
      }));
      setOriginalData(userData);
    }
  }, [loading, data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name !== "profilePhoto") {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prevState) => ({
          ...prevState,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any fields have changed
    const fieldsChanged =
      formState.username !== originalData.username ||
      formState.email !== originalData.email ||
      formState.profilePhoto !== originalData.profilePhoto ||
      formState.password !== "";

    if (fieldsChanged) {
      setMessage({ text: "", type: "" });
      setShowVerification(true);
    } else {
      setMessage({ text: "No changes detected.", type: "info" });
    }
  };

  const handleVerification = async (event) => {
    event.preventDefault();

    try {
      const { data: verifyData } = await verifyCredentials({
        variables: { email: data?.me?.email, password: currentPassword },
      });

      if (verifyData.verifyCredentials) {
        // If verification successful, proceed with update
        await updateUserProfile();
      } else {
        setMessage({ text: "Invalid current password", type: "error" });
      }
    } catch (err) {
      setMessage({
        text: "An error occurred while verifying credentials.",
        type: "error",
      });
    }
  };

  const updateUserProfile = async () => {
    try {
      const { data: updateData } = await updateUser({
        variables: { ...formState },
      });

      if (updateData.updateUser.token) {
        Auth.login(updateData.updateUser.token, false);
        refetch();
      }

      // Update original data to the new data
      const updatedUserData = {
        username: updateData.updateUser.user.username || "",
        email: updateData.updateUser.user.email || "",
        profilePhoto: updateData.updateUser.user.profilePhoto || "",
      };
      setOriginalData(updatedUserData);

      setMessage({ text: "Profile updated successfully!", type: "success" });
      setShowVerification(false);
      setCurrentPassword("");
      setFormState((prevState) => ({
        ...prevState,
        password: "",
      }));
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

  const handleGoBack = () => {
    setShowVerification(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen p-8 flex items-center justify-center">
      <div className="z-10 bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Update Profile
        </h1>

        {message.text && (
          <div
            className={`text-lg mb-4 p-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {!showVerification ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
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

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-lg mb-2"
              >
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

            {/* Password Field */}
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

            {/* Profile Photo Field */}
            <div>
              <label
                htmlFor="profilePhoto"
                className="block text-gray-700 text-lg mb-2"
              >
                Profile Photo
              </label>
              {formState.profilePhoto && (
                <img
                  src={formState.profilePhoto}
                  alt="Profile"
                  className="mb-4 h-24 w-24 object-cover rounded-full"
                />
              )}
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                className="w-full px-4 py-2"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
              Update Profile
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-gray-700 text-lg mb-2"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Verify & Update
              </button>
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 py-3 px-6 rounded-full text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 transition-all"
              >
                Go Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
