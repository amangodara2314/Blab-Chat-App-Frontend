import React, { useContext, useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../Context/Main";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { login } from "../Reducers/user";

const Profile = () => {
  const { user, selectedGroup } = useSelector((store) => store.user);
  const { API_BASE_URL, USER_URL } = useContext(MainContext);
  const { selectedChat } = useContext(MainContext);
  const [about, setAbout] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatcher = useDispatch();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (about == "" || user.about == about) {
      setIsEditing(false);

      return;
    }
    axios
      .put(API_BASE_URL + USER_URL + "set-about/" + user._id, { about: about })
      .then((success) => {
        if (success.data.status == 1) {
          setIsEditing(false);
          dispatcher(login({ user: success.data.user }));
        } else {
          console.log(success.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full h-full bg-gray-100 flex pt-8 justify-center relative">
      <Link
        onClick={() => {
          if (!selectedChat && !selectedGroup) {
            navigate("/");
          }
          if (selectedChat) {
            navigate("/");
            return;
          }
          if (selectedGroup) {
            navigate(`/group/${selectedGroup._id}`);
          }
        }}
        className="mr-4 absolute top-3 left-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </Link>
      <div className="full p-6 rounded-md">
        <div className="flex flex-col md:flex-row items-center mb-6 relative">
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-48 h-48 rounded-full mb-4 md:mb-0 md:mr-4"
          />
          <div>
            <h2 className="text-2xl lg:text-xl font-semibold">
              {user?.username}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div>
          <div className="md:flex md:items-center md:mb-4">
            {isEditing ? (
              <form onSubmit={handleSave} className="w-full">
                <div className="mb-4">
                  <label
                    htmlFor="about"
                    className="block text-gray-800 font-semibold mb-2"
                  >
                    About
                  </label>
                  <textarea
                    id="about"
                    value={about}
                    onChange={(e) => {
                      setAbout(e.target.value);
                    }}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="flex items-center">
                  <p className="text-gray-800 font-semibold">About</p>
                  <button
                    onClick={handleEdit}
                    className="text-black font-semibold p-2 rounded-md"
                  >
                    <LuPencil />
                  </button>
                </div>
                <p className="text-gray-600">{user?.about}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
