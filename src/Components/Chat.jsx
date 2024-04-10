import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../Context/Main";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import axios from "axios";
import socket from "../utils/socket";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

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
  } = useContext(MainContext);
  const messagesEndRef = useRef(null);

  const { user } = useSelector((store) => store.user);
  const [chat, setChat] = useState(null);
  const dispatcher = useDispatch();

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
      <div
        className={`md:hidden block fixed top-0 ${
          toggle ? "left-0" : "left-[100%]"
        } duration-500 min-w-full min-h-full bg-opacity-25 backdrop-filter backdrop-blur-lg text-black z-10`}
      >
        <ResponsiveSidebar />
      </div>
      {selectedChat == null ? (
        <div className="flex-grow bg-gray-100 relative">
          <div className="max-full mx-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 text-center">
                <p className="mb-4">Welcome to Blab!</p>
                <p className="mb-4">Select a user to start chatting.</p>
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
        <div className="flex-grow bg-gray-100 relative">
          <div className="bg-white shadow-sm px-3 py-3 lg:px-6 items-center justify-between flex sticky top-0">
            <div className="text-2xl font-semibold flex items-center gap-2 w-[70%]">
              <img
                src={selectedChat.avatar}
                className="w-12 h-12 rounded-full"
                alt=""
              />
              {selectedChat.username}
            </div>
            {/* <div className="flex items-center gap-3 relative">
              <Link to="/">
                <IoIosLogOut className="cursor-pointer text-xl" />
              </Link>
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
                className="h-8 w-8 text-gray-600 cursor-pointer md:hidden block"
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
            </div> */}
          </div>
          <div className={`max-full mx-auto p-2 md:p-6`}>
            <div
              className={`text-xl font-semibold text-center mt-48 text-gray-800 ${
                err.flag ? "" : "hidden"
              }`}
            >
              {err.msg}
            </div>
            <div className="flex flex-col mb-6">
              {chat == null
                ? ""
                : chat.messages.map((message, index) => {
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
                  })}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <form
            onSubmit={sendMessage}
            className="flex items-center rounded-lg absolute left-0 bottom-2 w-full px-2 gap-1"
          >
            <input
              type="text"
              name="text"
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 focus:outline-none rounded shadow-lg border border-gray-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chat;
