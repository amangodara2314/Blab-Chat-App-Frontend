import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../Context/Main";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { store } from "../store";
import axios from "axios";
import socket from "../utils/socket";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa6";

import ResponsiveSidebar from "./ResponsiveSidebar";
import { Link } from "react-router-dom";
const formatTimeFromTimestamp = require("../utils/formatTime");
function Chat(props) {
  const {
    API_BASE_URL,
    CHAT_URL,
    err,
    setErr,
    sendMessageNotification,
    toggle,
    setToggle,
    req,
    setShowNotification,
    newMessage,
    setNewMessage,
    selectedChat,
    setSelectedChat,
    handleLogout,
    isLogoutOpen,
    setIsLogoutOpen,
  } = useContext(MainContext);
  const messagesEndRef = useRef(null);

  const { user } = useSelector((store) => store.user);
  const [chat, setChat] = useState(null);
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, chat]);

  const fetchChat = () => {
    axios
      .get(
        API_BASE_URL +
          CHAT_URL +
          "get-chat/" +
          user._id +
          "/" +
          selectedChat._id
      )
      .then((success) => {
        if (success.data.status == 1) {
          setChat(success.data.chat);
        } else {
          setErr({ msg: success.data.msg, flag: true });
        }
      })
      .catch((err) => setErr({ msg: err.message, flag: true }));
  };

  useEffect(() => {
    if (selectedChat && user) {
      fetchChat();
    }
  }, [selectedChat]);

  const handleLogic = (sender) => {
    if (!selectedChat || selectedChat._id != sender) {
      const filter = [...newMessage, sender];
      setNewMessage(filter);
      return;
    }
    if (selectedChat._id == sender) {
      fetchChat();
      return;
    }
  };

  useEffect(() => {
    const handleFetchChat = (sender) => {
      handleLogic(sender);
      setErr({ msg: "", flag: false });
    };

    socket.on("fetchChat", handleFetchChat);

    return () => {
      socket.off("fetchChat", handleFetchChat);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    setChat(null);
    if (!selectedChat) {
      setErr({ msg: "", flag: false });
      return;
    }
    setErr({ msg: "", flag: false });

    fetchChat(user._id);
  }, [selectedChat]);

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(API_BASE_URL + CHAT_URL + "send-message", {
        sender: user._id,
        recipient: selectedChat._id,
        content: e.target.text.value,
      })
      .then((success) => {
        if (success.data.status == 1) {
          e.target.reset();
          setErr({ msg: "", flag: false });
          setChat(success.data.popChat);
          sendMessageNotification(selectedChat._id, user._id);
        } else {
          setErr({ msg: success.data.msg, flag: true });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ResponsiveSidebar />
      {isLogoutOpen ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded shadow mr-2"
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                  setIsLogoutOpen(false);
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow"
                onClick={() => {
                  setIsLogoutOpen(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {selectedChat == null ? (
        <div className="w-full bg-gray-100 relative min-h-screen">
          <div className="md:hidden sticky top-0">
            <div className="relative flex items-center justify-between bg-white shadow-sm p-4">
              <div className="flex gap-4">
                <IoIosLogOut
                  className="cursor-pointer text-xl"
                  onClick={() => {
                    setIsLogoutOpen(true);
                  }}
                />
                <Link to="/profile">
                  <FaUser className="cursor-pointer text-lg" />
                </Link>
                <MdOutlineNotificationAdd
                  className={`cursor-pointer ${
                    req === null || req.length === 0
                      ? "text-xl"
                      : "text-2xl text-yellow-300"
                  }`}
                  onClick={() => {
                    setShowNotification(true);
                  }}
                />
              </div>
              <svg
                onClick={() => {
                  setToggle(true);
                }}
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-600 cursor-pointer"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="2" y1="12" x2="18" y2="12"></line>
                <line x1="2" y1="6" x2="18" y2="6"></line>
                <line x1="2" y1="18" x2="18" y2="18"></line>
              </svg>
            </div>
            <div
              className={`absolute text-sm font-bold text-white bg-green-600 right-[8px] top-[10px] rounded-full px-[7px] py-[2px] ${
                newMessage.length == 0 ? "hidden" : ""
              }`}
            >
              {newMessage.length}
            </div>
          </div>
          <div className="w-full p-6">
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <p className="mb-4">Welcome to Blab!</p>
                <p className="mb-4">Select a user to start chatting.</p>
                <p className="mb-4 text-2xl text-red-400">
                  This Project is Under Progess
                </p>
                <p className="mb-4 text-2xl text-red-400">
                  Some Features May Not Work
                </p>
              </div>
            </div>
          </div>

          <form className="flex items-center rounded-lg absolute left-0 bottom-2 w-full px-2 gap-1">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 focus:outline-none rounded shadow-lg border border-gray-400"
              disabled
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-full bg-gray-100 flex flex-col justify-between">
          <div className="flex-grow min-h-full">
            <div className="min-h-full">
              <div className="bg-white shadow-sm px-3 py-3 lg:px-6 items-center justify-between flex sticky top-0">
                <div className="text-2xl font-semibold flex items-center gap-2 w-[70%]">
                  <img
                    src={selectedChat.avatar}
                    className="w-12 h-12 rounded-full"
                    alt=""
                  />
                  {selectedChat.username}
                </div>
                <div className="flex items-center gap-3 relative md:hidden">
                  <IoIosLogOut
                    className="cursor-pointer text-xl"
                    onClick={() => {
                      setIsLogoutOpen(true);
                    }}
                  />
                  <Link to="/profile">
                    <FaUser className="cursor-pointer text-lg" />
                  </Link>
                  <MdOutlineNotificationAdd
                    className={`cursor-pointer ${
                      req === null || req.length === 0
                        ? "text-xl"
                        : "text-2xl text-yellow-300"
                    }`}
                    onClick={() => {
                      setShowNotification(true);
                    }}
                  />
                  <svg
                    onClick={() => {
                      setToggle(true);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-600 cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="2" y1="12" x2="18" y2="12"></line>
                    <line x1="2" y1="6" x2="18" y2="6"></line>
                    <line x1="2" y1="18" x2="18" y2="18"></line>
                  </svg>
                  <div
                    className={`absolute text-sm font-bold text-white bg-green-600 right-[-4px] top-[-3px] rounded-full px-[7px] py-[2px] ${
                      newMessage.length == 0 ? "hidden" : ""
                    }`}
                  >
                    {newMessage.length}
                  </div>
                </div>
              </div>
              <div className={`w-full mx-auto p-2 md:pt-6 md:px-6`}>
                <div
                  className={`text-xl font-semibold text-center mt-48 text-gray-800 ${
                    err.flag ? "" : "hidden"
                  }`}
                >
                  {err.msg}
                </div>
                <div className="flex flex-col h-full">
                  {chat == null ? (
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
                  ) : (
                    chat.messages.map((message, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            message.sender == user._id
                              ? "bg-green-400 self-end"
                              : "bg-blue-500 self-start text-white"
                          } p-2 px-3 rounded-lg mb-2`}
                        >
                          <div className="flex flex-col">
                            <span>{message.content}</span>
                            <div className="text-right text-[10px]">
                              {formatTimeFromTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-2 w-full">
            <form
              onSubmit={sendMessage}
              className="flex items-center rounded-lg px-2 gap-1"
            >
              <input
                type="text"
                name="text"
                placeholder="Type your message..."
                className="px-4 py-2 focus:outline-none rounded w-full shadow-lg border border-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
