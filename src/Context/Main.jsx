import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import socket from "../utils/socket";
import { logout, lsToState } from "../Reducers/user";
export const MainContext = createContext();

function Main(props) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const USER_URL = process.env.REACT_APP_USER_URL;
  const FRIEND_URL = process.env.REACT_APP_FRIEND_URL;
  const CHAT_URL = process.env.REACT_APP_CHAT_URL;

  const [result, setResult] = useState([]);
  const dispatcher = useDispatch();
  const [err, setErr] = useState({ msg: "", flag: false });
  const [req, setReq] = useState(null);
  const [notify, setNotify] = useState(false);
  const [friends, setFriends] = useState(null);
  const [newMessage, setNewMessage] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const sendRequest = (data) => {
    socket.emit("send-request", data);
  };

  const sendMessageNotification = (recipient, sender) => {
    socket.emit("send-message", { recipient, sender });
  };

  const localToState = () => {
    const lsuser = JSON.parse(localStorage.getItem("user"));
    const lschat = JSON.parse(localStorage.getItem("chat"));
    const lsMsg = JSON.parse(localStorage.getItem("newMessage"));
    if (lschat != null) {
      setSelectedChat(lschat);
    }
    if (lsMsg != null) {
      setNewMessage(lsMsg);
    }
    dispatcher(lsToState({ user: lsuser }));
  };

  useEffect(() => {
    localToState();
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(selectedChat));
    localStorage.setItem("newMessage", JSON.stringify(newMessage));
  }, [selectedChat, newMessage]);
  const fetchReq = (id) => {
    axios
      .get(API_BASE_URL + FRIEND_URL + "get/" + id)
      .then((success) => {
        let temp = success.data.user.map((item) => ({
          ...item.sender,
          reqId: item._id,
        }));

        setReq(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLogout = () => {
    dispatcher(logout());
    setNewMessage([]);
    setSelectedChat(null);
  };

  const handleRequest = (reqId, userId, flag) => {
    axios
      .put(
        API_BASE_URL +
          FRIEND_URL +
          "accept-req/" +
          reqId +
          "/" +
          userId +
          "/" +
          flag
      )
      .then((success) => {
        fetchReq(userId);
        fetchFriends(userId);
        if (success.data.status == 1) {
          socket.emit("requestAccepted", success.data.sender);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchFriends = (userId) => {
    axios
      .get(API_BASE_URL + USER_URL + "get-friends/" + userId)
      .then((success) => {
        setFriends(success.data.friends);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <MainContext.Provider
      value={{
        err,
        setErr,
        USER_URL,
        API_BASE_URL,
        dispatcher,
        setResult,
        result,
        sendRequest,
        notify,
        setNotify,
        fetchReq,
        handleRequest,
        req,
        fetchFriends,
        friends,
        localToState,
        CHAT_URL,
        sendMessageNotification,
        setNewMessage,
        newMessage,
        toggle,
        setToggle,
        setShowNotification,
        showNotification,
        setSelectedChat,
        selectedChat,
        handleLogout,
        setIsLogoutOpen,
        isLogoutOpen,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}

export default Main;
