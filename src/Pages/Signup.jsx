import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../Context/Main";
import axios from "axios";
import { useSelector } from "react-redux";
import { signup } from "../Reducers/user";
import multiavatar from "@multiavatar/multiavatar/esm";

function Signup(props) {
  const { setErr, err, USER_URL, API_BASE_URL, dispatcher } =
    useContext(MainContext);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (nav) {
      console.log("called");
      navigate("/");
      setNav(false);
    }
  }, [nav]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDisabled(true);
    setIsLoading(true);

    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      avatars: `https://api.multiavatar.com/${username}.png`,
    };
    if (data.username === "" || data.email === "" || data.password === "") {
      setErr({ msg: "Please Fill All The Inputs", flag: true });
      return;
    }

    if (data.password === e.target.confirmPassword.value) {
      setErr({ msg: "", flag: false });
      axios
        .post(API_BASE_URL + USER_URL + "create-user", data)
        .then((success) => {
          console.log(success.data);
          if (success.data.status == 1) {
            setIsDisabled(false);
            setIsLoading(false);

            dispatcher(signup({ user: success.data.user }));
            setNav(true);
          } else {
            setIsDisabled(false);
            setIsLoading(false);

            setErr({ msg: success.data.msg, flag: true });
          }
        })
        .catch((err) => {
          setIsDisabled(false);
          setIsLoading(false);

          setErr({ msg: err.message, flag: true });
        });
    } else {
      setErr({ msg: "Both Passwords Must Match", flag: true });
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-indigo-600 to-purple-500">
      <div className="lg:flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-white text-center">
          <div className="text-5xl font-bold mb-6">Welcome to BLAB</div>
          <p className="text-xl font-semibold">Please signup to continue</p>
        </div>
      </div>

      <div className="lg:flex-1 flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
        >
          <div className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Create New Account
          </div>
          {isLoading && (
            <div
              role="status"
              className={`w-full h-full flex items-center justify-center ${
                err.flag ? "hidden" : ""
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div
            className={`mb-4 flex ${
              username == "" ? "flex-col" : "gap-3 items-center"
            }`}
          >
            <label
              htmlFor=""
              className="block text-gray-700 font-semibold mb-2"
            >
              Your Avatar
            </label>
            {username == "" ? (
              "Write Your Username For an Avatar"
            ) : (
              <img
                src={`https://api.multiavatar.com/${username}.png`}
                className="w-16 h-16"
                alt=""
              />
            )}
          </div>
          <button
            disabled={isDisabled}
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
