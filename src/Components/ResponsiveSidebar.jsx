import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../Context/Main";
import { useDispatch, useSelector } from "react-redux";
import { IoMdPersonAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FiUserCheck } from "react-icons/fi";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import socket from "../utils/socket";
import { setSelectedGroup, filterNewGroupMessage } from "../Reducers/user";

function ResponsiveSidebar(props) {
  const {
    API_BASE_URL,
    USER_URL,
    setToggle,
    toggle,
    setResult,
    result,
    sendRequest,
    selectedChat,
    setSelectedChat,
    newMessage,
    setNewMessage,
    setGroupChat,
    showNotification,
    setShowNotification,
    newGroup,
    dispatcher,
    friends,
    groups,
    activeTab,
    setNewGroup,
    setActiveTab,
    setCreateGroup,
    setIsLogoutOpen,
  } = useContext(MainContext);
  const { user, newGroupMessage, selectedGroup } = useSelector(
    (store) => store.user
  );
  const navigator = useNavigate();
  const [query, setQuery] = useState("");

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

  const closeSidebar = () => {
    setToggle(false);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`md:hidden chat-sidebar ${toggle ? "open" : ""}`}>
      <div className="fixed inset-0 flex flex-col bg-indigo-600 text-white">
        <div className="flex justify-between items-center p-4">
          <div className="text-2xl font-semibold">Welcome to BLAB</div>
          <IoMdClose
            className="text-2xl"
            onClick={() => {
              closeSidebar();
            }}
          />
        </div>
        <div className="px-4">
          {/* Add Friend Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Add Friend"
            className="w-full px-3 py-2 rounded-lg bg-white focus:outline-none text-black"
          />
          {/* Search Results */}
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
              <ul className="h-[300px] overflow-y-scroll">
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
        <ul>
          <li className="flex items-center justify-center gap-8 p-3">
            <div
              className={`text-lg font-semibold text-white cursor-pointer relative flex-grow text-center ${
                activeTab === "chat" ? "active-tab" : ""
              }`}
              onClick={() => toggleTab("chat")}
            >
              Chat
              {newMessage.length != 0 && activeTab === "groups" ? (
                <div
                  className={`text-[12px] font-semibold text-green-400 absolute drop-shadow right-[-12px] top-[-15px]`}
                >
                  New Message
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              className={`text-lg font-semibold text-white cursor-pointer relative flex-grow text-center ${
                activeTab === "groups" ? "active-tab" : ""
              }`}
              onClick={() => {
                toggleTab("groups");
                if (newGroup) {
                  setNewGroup(false);
                }
              }}
            >
              Groups
              {newGroup && activeTab === "chat" ? (
                <div
                  className={`text-[12px] font-semibold text-green-400 absolute drop-shadow ${
                    newGroupMessage.length == 0 ? "right-0" : "right-[70px]"
                  } top-[-15px]`}
                >
                  New Group
                </div>
              ) : (
                ""
              )}
              {newGroupMessage.length != 0 && activeTab === "chat" ? (
                <div
                  className={`text-[12px] font-semibold text-green-400 absolute drop-shadow right-[-12px] top-[-15px]`}
                >
                  New Message
                </div>
              ) : (
                ""
              )}
            </div>
          </li>

          {activeTab === "chat" && (
            <>
              {friends && friends.length === 0 ? (
                <div className="text-center text-white text-md font-semibold w-full mt-8">
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
                          setToggle(false);
                          dispatcher(setSelectedGroup({ g: null }));
                          if (newMessage.includes(u._id)) {
                            const filter = newMessage.filter(
                              (m) => m !== u._id
                            );
                            setNewMessage(filter);
                          }
                          navigator("/");
                          return;
                        }
                        if (selectedChat._id === u._id) {
                          navigator("/");
                          setToggle(false);
                          dispatcher(setSelectedGroup({ g: null }));
                          return;
                        }
                        if (selectedChat._id !== u._id) {
                          setSelectedChat(u);
                          setToggle(false);
                          dispatcher(setSelectedGroup({ g: null }));
                          if (newMessage.includes(u._id)) {
                            const filter = newMessage.filter(
                              (m) => m !== u._id
                            );
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
                            selectedChat && selectedChat._id === u._id
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
            </>
          )}
          {activeTab === "groups" && (
            <>
              {groups && groups?.length === 0 ? (
                <div className="text-center text-white text-md font-semibold w-full mt-8">
                  No groups available
                </div>
              ) : (
                groups &&
                groups?.map((g, index) => {
                  const newMsg = newGroupMessage.some((m) => m == g._id);
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (!selectedGroup) {
                          navigator(`/group/${g._id}`);
                          setToggle(false);
                          setSelectedChat(null);
                          dispatcher(filterNewGroupMessage({ g: g }));
                          dispatcher(setSelectedGroup({ g: g }));
                          socket.emit("join_room", g._id);
                          return;
                        }
                        if (selectedGroup._id == g._id) {
                          navigator(`/group/${g._id}`);
                          setToggle(false);
                          socket.emit("join_room", g._id);
                          return;
                        }
                        if (selectedGroup._id != g._id) {
                          socket.emit("leaveRoom", selectedGroup._id);
                          setSelectedChat(null);
                          setGroupChat(null);
                          setToggle(false);
                          dispatcher(filterNewGroupMessage({ g: g }));
                          socket.emit("join_room", g._id);
                          dispatcher(setSelectedGroup({ g: g }));
                          navigator(`/group/${g._id}`);
                          return;
                        }
                      }}
                      className={`flex justify-between items-center p-3 rounded-lg mb-2 transition duration-300 hover:bg-blue-600 cursor-pointer text-white ${
                        selectedGroup?._id == g?._id ? "bg-blue-600" : ""
                      }`}
                    >
                      <Link className="flex gap-2 items-center w-[70%]">
                        <img
                          src={g?.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{g?.name}</span>
                          <span className="text-gray-300">
                            created by {""}
                            {g?.admin.username}
                          </span>
                        </div>
                      </Link>
                      {selectedGroup?._id != g?._id ? (
                        <div
                          className={`text-[12px] font-semibold text-green-400 drop-shadow ${
                            newMsg ? "" : "hidden"
                          }`}
                        >
                          New Message
                        </div>
                      ) : (
                        ""
                      )}
                    </li>
                  );
                })
              )}
            </>
          )}
        </ul>
        <div className="w-full flex justify-center gap-2">
          <button
            onClick={() => {
              setIsLogoutOpen(true);
            }}
            className="px-3 py-2 mt-2 bg-red-500 text-white font-semibold rounded"
          >
            Logout
          </button>
          <button
            onClick={() => {
              setCreateGroup(true);
            }}
            className="px-3 py-2 mt-2 bg-green-600 text-white font-semibold rounded"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResponsiveSidebar;
