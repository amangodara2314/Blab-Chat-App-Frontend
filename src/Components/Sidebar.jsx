import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MainContext } from "../Context/Main";
import { IoMdPersonAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { store } from "../store";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";
import { FiUserCheck } from "react-icons/fi";

function Sidebar(props) {
  const {
    API_BASE_URL,
    USER_URL,
    result,
    setResult,
    sendRequest,
    req,
    handleRequest,
    fetchReq,
    friends,
    dispatcher,
    setShowNotification,
    showNotification,
    setSelectedChat,
    selectedChat,
    newMessage,
    setNewMessage,
    setIsLogoutOpen,
  } = useContext(MainContext);
  const [query, setQuery] = useState("");
  const { user } = useSelector((store) => store.user);
  const navigator = useNavigate();

  useEffect(() => {
    if (query != "") {
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
    <>
      {showNotification && (
        <div
          className="fixed w-screen min-h-screen flex justify-center items-center z-20"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="text-lg mb-6 flex items-center justify-between">
              <span className="text-gray-500">Friend Requests</span>
              <IoMdClose
                onClick={() => {
                  setShowNotification(false);
                }}
                className="text-xl cursor-pointer"
              />
            </div>
            <div className="">
              <div
                role="status"
                className={`${req == null ? "flex justify-center" : "hidden"}`}
              >
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
              {req && req.length == 0 ? (
                <div className="text-center text-gray-400 text-sm font-semibold w-full mt-4">
                  No Request Yet
                </div>
              ) : (
                req &&
                req.map((u, index) => {
                  return (
                    <div key={index} className="flex justify-between w-full">
                      <div className="w-full flex gap-2">
                        <img
                          src={u.avatar}
                          width={48}
                          className="w-18 h-18 rounded-full"
                          alt=""
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{u.username}</span>
                          <span className="text-sm text-gray-500">
                            {u.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <IoMdClose
                          className="cursor-pointer"
                          onClick={() => {
                            handleRequest(u.reqId, user._id, false);
                          }}
                        />
                        <IoMdCheckmark
                          className="cursor-pointer"
                          onClick={() => {
                            handleRequest(u.reqId, user._id, true);
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      <div className="hidden md:block w-[35%] xl:w-1/3 2xl:w-1/4 bg-indigo-600 sticky top-0">
        <div className="sticky top-0 left-0 p-3 lg:p-4">
          <div className="text-white mb-4 flex lg:flex-row flex-col lg:items-center gap-2 lg:gap-0 justify-between">
            <div className="text-2xl font-semibold">Welcome to BLAB</div>
            <div className="flex gap-3 items-center">
              <MdOutlineNotificationAdd
                className={`cursor-pointer ${
                  req == null || req.length == 0
                    ? "text-xl"
                    : "text-2xl text-yellow-300"
                }`}
                onClick={() => {
                  setShowNotification(true);
                }}
              />

              <Link to="/profile">
                <FaUser className="cursor-pointer" />
              </Link>
              <IoIosLogOut
                className="cursor-pointer text-xl"
                onClick={() => {
                  setIsLogoutOpen(true);
                }}
              />
            </div>
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Add Friend"
              className="w-full px-3 py-2 rounded-lg bg-white focus:outline-none"
            />
            <div
              className={`${
                query == "" ? "hidden" : ""
              } bg-white p-4 absolute w-full top-12 rounded z-10`}
            >
              {result.length == 0 ? (
                <div className="text-center text-sm font-semibold text-gray-600">
                  No users found
                </div>
              ) : (
                <ul className="">
                  {result.map((u, index) => {
                    const isFriend = friends.some((f) => f._id == u._id);
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
                              <span className="font-bold">{u.username}</span>
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
                              className="text-lg cursor-pointer"
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
          <ul>
            <div
              role="status"
              className={`${req == null ? "flex justify-center" : "hidden"}`}
            >
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-100 animate-spin dark:text-gray-400 fill-gray-400 dark:fill-gray-300"
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
            {friends && friends.length == 0 ? (
              <div className="text-center text-gray-900 text-md font-semibold w-full mt-8">
                Add Friends To Chat
              </div>
            ) : (
              friends &&
              friends.map((u, index) => {
                const isNewMessage = newMessage.some((m) => m == u._id);

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
                        return;
                      }
                      if (selectedChat._id == u._id) {
                        navigator("/");
                        return;
                      }
                      if (selectedChat._id != u._id) {
                        setSelectedChat(u);
                        if (newMessage.includes(u._id)) {
                          const filter = newMessage.filter((m) => m != u._id);
                          setNewMessage(filter);
                        }

                        navigator("/");
                        return;
                      }
                    }}
                    key={index}
                    className={`
                  flex justify-between w-full cursor-pointer
                  text-white p-3 duration-500 rounded outline-none
                  hover:backdrop-blur-lg hover:bg-blue-600 hover:shadow
                  group mb-2 ${
                    selectedChat && selectedChat._id == u._id
                      ? "bg-blue-600"
                      : ""
                  }`}
                  >
                    <div className="w-full flex justify-between relative">
                      <div className="flex gap-2">
                        <img
                          src={u.avatar}
                          width={48}
                          className="w-18 h-18 rounded-full filter brightness-95 group-hover:brightness-100"
                          alt=""
                        />
                        <div className="flex flex-col text-wrap">
                          <span className="font-semibold text-white">
                            {u.username}
                          </span>
                          <span className="text-sm text-gray-200">
                            {u.email}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`font-semibold text-[12px] text-nowrap absolute right-0 top-0 text-green-400 ${
                          isNewMessage ? "" : "hidden"
                        }`}
                      >
                        New Message
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
