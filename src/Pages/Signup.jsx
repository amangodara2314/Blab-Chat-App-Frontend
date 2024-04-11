import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../Context/Main";
import axios from "axios";
import { useSelector } from "react-redux";
import { signup } from "../Reducers/user";

function Signup(props) {
  const { setErr, err, USER_URL, API_BASE_URL, dispatcher } =
    useContext(MainContext);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const avatars = [
    "https://shorturl.at/yQTZ7",
    "https://shorturl.at/inzFT",
    "https://shorturl.at/cnxS7",
    "https://shorturl.at/syQZ7",
    "https://shorturl.at/ciyA4",
  ];

  useEffect(() => {
    setErr({ msg: "", flag: false });
  }, []);
  useEffect(() => {
    if (selectedAvatar !== "") {
      setErr({ msg: "", flag: false });
    }
  }, [selectedAvatar]);

  useEffect(() => {
    if (nav) {
      console.log("called");
      navigate("/");
      setNav(false);
    }
  }, [nav]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      avatars: selectedAvatar,
    };
    if (data.username === "" || data.email === "" || data.password === "") {
      setErr({ msg: "Please Fill All The Inputs", flag: true });
      return;
    }

    if (selectedAvatar === "") {
      setErr({ msg: "Please Choose an Avatar", flag: true });
      return;
    }

    if (data.password === e.target.confirmPassword.value) {
      setErr({ msg: "", flag: false });
      axios
        .post(API_BASE_URL + USER_URL + "create-user", data)
        .then((success) => {
          console.log(success.data);
          if (success.data.status == 1) {
            dispatcher(signup({ user: success.data.user }));
            setNav(true);
          } else {
            setErr({ msg: success.data.msg, flag: true });
          }
        })
        .catch((err) => setErr({ msg: err.message, flag: true }));
    } else {
      setErr({ msg: "Both Passwords Must Match", flag: true });
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-indigo-600 to-purple-500">
      {/* Welcome side */}
      <div className="lg:flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-white text-center">
          <div className="text-5xl font-bold mb-6">Welcome to BLAB</div>
          <p className="text-xl font-semibold">Please signup to continue</p>
        </div>
      </div>

      {/* Form side */}
      <div className="lg:flex-1 flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
        >
          <div className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Create New Account
          </div>
          <div
            className={`text-sm font-semibold text-center text-red-800 ${
              err.flag ? "" : "hidden"
            }`}
          >
            {err.msg}
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor=""
              className="block text-gray-700 font-semibold mb-2"
            >
              Choose Avatar
            </label>
            <div className="flex lg:justify-between flex-wrap lg:gap-0 gap-2">
              {avatars.map((avatar, index) => (
                <img
                  onClick={() => {
                    setSelectedAvatar(avatar);
                  }}
                  src={avatar}
                  key={index}
                  alt=""
                  className={`w-16 h-16 cursor-pointer duration-75 ${
                    selectedAvatar === avatar ? "border-2 border-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full mb-6 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Signup
          </button>
          <Link to="/login">
            <span className="text-blue-800 text-sm font-bold">
              Already Have an Account ?
            </span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
