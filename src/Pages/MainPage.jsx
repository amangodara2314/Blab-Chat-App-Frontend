import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import socket from "../utils/socket";
import { MainContext } from "../Context/Main";
import { lsToState } from "../Reducers/user";
import ResponsiveSidebar from "../Components/ResponsiveSidebar";

function MainPage(props) {
  const {
    fetchReq,
    fetchFriends,
    activeTab,
    setNewGroup,
    fetchGroups,
    localToState,
    newGroupMessage,
    setNewGroupMessage,
    selectedGroup,
  } = useContext(MainContext);
  const { user } = useSelector((store) => store.user);
  const navigator = useNavigate();
  const dispatcher = useDispatch();

  useEffect(() => {
    const lsuser = JSON.parse(localStorage.getItem("user"));
    const lsGroup = JSON.parse(localStorage.getItem("group"));

    if (lsGroup) {
      navigator(`group/${lsGroup._id}`);
    }
    dispatcher(lsToState({ user: lsuser }));

    if (!lsuser) {
      navigator("/login");
    } else {
      socket.emit("login", lsuser._id);
    }
  }, []);
  useEffect(() => {
    socket.on("friendRequestReceived", async (data) => {
      await localToState();
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
  useEffect(() => {
    socket.on("groupAddedNotification", (data) => {
      if (user) {
        fetchGroups(user._id);
        if (activeTab === "chat") {
          setNewGroup(true);
        }
      }
    });
  }, [socket, user, activeTab]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-grow min-h-full">
        <div className="md:hidden">
          <ResponsiveSidebar />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainPage;
