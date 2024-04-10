import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../Context/Main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../Reducers/user";
function Login(props) {
  const { API_BASE_URL, USER_URL, err, setErr } = useContext(MainContext);
  const dispatcher = useDispatch();
  const navigator = useNavigate();
  const loginUser = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    axios
      .post(API_BASE_URL + USER_URL + "login", data)
      .then((success) => {
        if (success.data.status == 1) {
          dispatcher(login({ user: success.data.user }));
          navigator("/");
        } else {
          setErr({ msg: success.data.msg, flag: true });
        }
      })
      .catch((err) => setErr({ msg: err.message, flag: true }));
  };
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-600 to-purple-500">
      {/* Welcome side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-white text-center">
          <h2 className="text-5xl font-bold mb-6">Welcome to BLAB</h2>
          <p className="text-xl font-semibold">Please login to continue</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <form
          onSubmit={loginUser}
          className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
        >
          <div className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Login
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
          <div className="mb-6">
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
          <button
            type="submit"
            className="w-full mb-4 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          <Link to="/signup">
            <span className="text-blue-800 text-sm font-bold">
              Don't Have an Account Yet ?
            </span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
