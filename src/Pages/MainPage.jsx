import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { lsToState } from "../Reducers/user";
import socket from "../utils/socket";
import { MainContext } from "../Context/Main";

function MainPage(props) {
  const { fetchReq, fetchFriends } = useContext(MainContext);
  const { user } = useSelector((store) => store.user);
  const navigator = useNavigate();
  const dispatcher = useDispatch();

  useEffect(() => {
    const lsuser = JSON.parse(localStorage.getItem("user"));
    dispatcher(lsToState({ user: lsuser }));

    if (!lsuser) {
      navigator("/login");
    } else {
      socket.emit("login", lsuser._id);
    }
  }, []);
  useEffect(() => {
    socket.on("friendRequestReceived", async (data) => {
      await lsToState();
      if (user != null) {
        fetchReq(user._id);
      }
    });
    socket.on("fetchData", () => {
      if (user) {
        fetchFriends(user._id);
      }
    });
  }, [socket, user]);

  useEffect(() => {
    if (user != null) {
      fetchReq(user._id);
      fetchFriends(user._id);
    }
  }, [user]);
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-grow flex">
        <Outlet />
      </div>
    </div>
  );
}

export default MainPage;
