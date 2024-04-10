import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../Context/Main";
import { useDispatch, useSelector } from "react-redux";
import { IoMdPersonAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FiUserCheck } from "react-icons/fi";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function ResponsiveSidebar(props) {
  const formatTimeFromTimestamp = require("../utils/formatTime");
  const {
    API_BASE_URL,
    setToggle,
    USER_URL,

    friends,
    setResult,
    result,
    sendRequest,
    selectedChat,
    setSelectedChat,
    newMessage,
    setNewMessage,
  } = useContext(MainContext);
  const { user } = useSelector((store) => store.user);
  const dispatcher = useDispatch();

  const [query, setQuery] = useState("");
  const navigator = useNavigate();

  useEffect(() => {
    if (query !== "") {
      fetchUsers();
    }
  }, [query]);

  const fetchUsers = () => {
    axios
      .get(API_BASE_URL + USER_URL + "get-users/" + query + "/" + user.email)
      .then((success) => {
        setResult(success.data.searchedUsers);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-indigo-600 text-white">
      <div className="flex justify-between items-center p-4">
        <div className="text-2xl font-semibold">Welcome to BLAB</div>
        <IoMdClose
          className="text-2xl"
          onClick={() => {
            setToggle(false);
          }}
        />
      </div>
      <div className="px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Add Friend"
          className="w-full px-3 py-2 rounded-lg bg-white focus:outline-none text-black"
        />
        <div
          className={`${
            query === "" ? "hidden" : ""
          } bg-white p-4 rounded-lg mt-2`}
        >
          {result.length === 0 ? (
            <div className="text-center text-sm font-semibold text-gray-600">
              No users found
            </div>
          ) : (
            <ul>
              {result.map((u, index) => {
                const isFriend = friends.some((f) => f._id === u._id);
                return (
                  <li key={index} className="mb-2">
                    <button className="flex justify-between items-center px-3 py-3 rounded-lg transition duration-300 hover:shadow-xl w-full text-left border">
                      <div className="flex gap-2 xl:gap-4">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full mt-1"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-black">
                            {u.username}
                          </span>
                          <span className="text-gray-500 text-wrap">
                            {u.email}
                          </span>
                        </div>
                      </div>
                      {isFriend ? (
                        <div className="text-lg text-green-700">
                          <FiUserCheck />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            sendRequest({
                              recipientId: u._id,
                              senderId: user._id,
                            });
                          }}
                          className="text-lg cursor-pointer text-black"
                        >
                          <IoMdPersonAdd />
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto mt-3">
        {friends && friends.length === 0 ? (
          <div className="text-center text-gray-900 text-md font-semibold p-4">
            Add Friends To Chat
          </div>
        ) : (
          friends &&
          friends.map((u, index) => {
            const isNewMessage = newMessage.some((m) => m === u._id);

            return (
              <li
                onClick={() => {
                  if (!selectedChat) {
                    setSelectedChat(u);
                    if (newMessage.includes(u._id)) {
                      const filter = newMessage.filter((m) => m != u._id);
                      setNewMessage(filter);
                    }
                    navigator("/");
                    setToggle(false);
                    return;
                  }
                  if (selectedChat._id == u._id) {
                    navigator("/");
                    setToggle(false);
                    return;
                  }
                  if (selectedChat._id != u._id) {
                    setSelectedChat(u);
                    if (newMessage.includes(u._id)) {
                      const filter = newMessage.filter((m) => m != u._id);
                      setNewMessage(filter);
                    }

                    navigator("/");
                    setToggle(false);
                    return;
                  }
                }}
                key={index}
                className={`
                flex justify-between items-center p-4 duration-500 rounded outline-none
                hover:bg-blue-600 group mb-2 ${
                  selectedChat && selectedChat._id === u._id
                    ? "bg-blue-600"
                    : ""
                }`}
              >
                <div className="flex gap-2">
                  <img
                    src={u.avatar}
                    width={48}
                    className="w-10 h-10 rounded-full filter brightness-95 group-hover:brightness-100"
                    alt=""
                  />
                  <div className="flex flex-col text-wrap">
                    <span className="font-semibold">{u.username}</span>
                    <span className="text-sm text-gray-200">{u.email}</span>
                  </div>
                </div>
                <div
                  className={`font-semibold text-[12px] text-nowrap text-green-400 ${
                    isNewMessage ? "" : "hidden"
                  }`}
                >
                  New Message
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default ResponsiveSidebar;
