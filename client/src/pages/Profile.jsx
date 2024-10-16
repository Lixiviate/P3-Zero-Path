import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_ME } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const Profile = () => {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (data?.me) {
      setFormState({
        username: data.me.username || "",
        email: data.me.email || "",
        password: "",
      });
      setProfileImage(data.me.profileImageUrl || null);
    }
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await updateUser({
        variables: { 
          ...formState, 
          profileImage: profileImage && profileImage.startsWith('data:') ? profileImage : undefined
        },
      });
  
      if (data.updateUser.token) {
        Auth.login(data.updateUser.token);
      }
  
      setMessage({ text: "Profile updated successfully!", type: "success" });
      refetch();
    } catch (err) {
      setMessage({
        text: err.message || "An error occurred while updating your profile.",
        type: "error",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-b from-teal-300 to-blue-500 min-h-screen p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Update Profile</h1>

        {message.text && (
          <div className={`text-lg mb-4 p-4 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="mb-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-4xl">👤</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Upload Profile Picture
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-lg mb-2">Username</label>
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
            <label htmlFor="email" className="block text-gray-700 text-lg mb-2">Email</label>
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
            <label htmlFor="password" className="block text-gray-700 text-lg mb-2">New Password</label>
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