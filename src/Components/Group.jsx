import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { MdOutlineNotificationAdd } from "react-icons/md";
import axios from "axios";
import { MainContext } from "../Context/Main";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { store } from "../store";
import { useParams, useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import formatTimeFromTimestamp from "../utils/formatTime";
import socket from "../utils/socket";
import { logout, setNewGroupMessage, setSelectedGroup } from "../Reducers/user";
import { IoMdPersonAdd } from "react-icons/io";
import { FiUserCheck } from "react-icons/fi";
import Select from "react-select";
import { IoSendSharp } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";

function Group(props) {
  const {
    setSelectedMembers,
    friends,
    API_BASE_URL,
    GROUP_URL,
    setErr,
    setToggle,
    fetchGroups,
    setIsLogoutOpen,
    newMessage,
    groupChat,
    getChat,
    setGroupChat,
    toggle,
    setShowNotification,
    isLogoutOpen,
    setCreateGroup,
    setOpenGroupDetails,
    openGroupDetails,
    sendRequest,
    selectedMembers,
  } = useContext(MainContext);

  const { user, selectedGroup, newGroupMessage } = useSelector(
    (store) => store.user
  );
  const messagesEndRef = useRef(null);
  const dispatcher = useDispatch();
  const { groupId } = useParams();
  const id = groupId;
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      socket.emit("join_room", selectedGroup._id);
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [groupChat]);

  const [file, setFile] = useState(null);
  const [fileAdded, setFileAdded] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState("");

  const handleClick = (imageURL) => {
    setFullImage(imageURL);
    setShowModal(true);
  };
  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileAdded(true);
  };

  useEffect(() => {
    socket.on("removedFromGroup", (group) => {
      if (selectedGroup && selectedGroup._id === group) {
        fetchGroups(user._id);
        navigate("/removed-from-group");
      } else {
        fetchGroups(user._id);
      }
    });

    return () => {
      socket.off("removedFromGroup");
    };
  }, [selectedGroup, navigate]);

  const addMembers = () => {
    axios
      .put(
        API_BASE_URL + GROUP_URL + "add-member/" + selectedGroup._id,
        selectedMembers
      )
      .then((success) => {
        fetchGroups(user._id);
        socket.emit("new-group", {
          members: selectedMembers,
          group: success.data.group,
        });
        dispatcher(setSelectedGroup({ g: success.data.group }));
        setOpenGroupDetails(false);
      })
      .catch((err) => console.log(err));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitHandler = (e) => {
    setIsDisabled(true);
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, GIF)");
        return;
      }
    }

    if (e.target.text.value == "" && file == null) {
      return;
    }

    formData.append("content", e.target.text.value);
    formData.append("sender", user._id);
    formData.append("groupId", selectedGroup._id);
    if (e.target.text.value != "" || file != null) {
      axios
        .post(
          API_BASE_URL + GROUP_URL + "send-message/" + selectedGroup._id,
          formData
        )
        .then((success) => {
          if (success.data.status == 1) {
            setIsDisabled(false);
            e.target.reset();
            dispatcher(setSelectedGroup({ g: success.data.popGroup }));
            setFile(null);
            setFileAdded(false);
            socket.emit("groupMessageNotification", {
              group: selectedGroup._id,
              members: selectedGroup.participants,
              message: success.data.msg,
            });
          } else {
            setIsDisabled(false);
            setErr({ msg: success.data.msg, flag: true });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (user && selectedGroup) {
      getChat();
    }
  }, [selectedGroup]);

  const removeMember = (memberId) => {
    axios
      .put(API_BASE_URL + GROUP_URL + "remove-member/" + selectedGroup._id, {
        memberId: memberId,
      })
      .then((success) => {
        socket.emit("removed", {
          memberId: memberId,
          group: success.data.group._id,
        });
        fetchGroups(user._id);
        dispatcher(setSelectedGroup({ g: success.data.group }));
        setOpenGroupDetails(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteGroup = () => {
    axios
      .delete(API_BASE_URL + GROUP_URL + "delete-group/" + selectedGroup._id)
      .then((success) => {
        const temp = selectedGroup.participants.filter(
          (m) => m._id != user._id
        );
        socket.emit("deleted", {
          members: temp,
          group: selectedGroup._id,
        });
        fetchGroups(user._id);
        navigate("/");
        dispatcher(setSelectedGroup({ g: null }));
        setOpenGroupDetails(false);
      })
      .catch((err) => console.log(err));
  };

  const handleGroupMessage = useCallback(
    (data) => {
      if (user) {
        fetchGroups(user._id);
        if (!newGroupMessage.includes(data.group)) {
          dispatcher(setNewGroupMessage({ group: data.group }));
          return;
        }
      }
    },
    [socket, selectedGroup, user, fetchGroups, newGroupMessage, dispatcher]
  );

  const handleGroup = useCallback(
    ({ data, offlineUser }) => {
      setGroupChat((prevChat) => [...prevChat, data.message]);
    },
    [socket, user]
  );

  useEffect(() => {
    socket.on("newGroupMessage", handleGroupMessage);

    return () => {
      socket.off("newGroupMessage", handleGroupMessage);
    };
  }, [socket, user]);

  useEffect(() => {
    socket.on("groupMessage", handleGroup);

    return () => {
      socket.off("groupMessage", handleGroup);
    };
  }, [socket, user]);

  return (
    selectedGroup && (
      <>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="max-w-full max-h-full mx-auto flex justify-center">
              <img
                src={fullImage}
                className="w-[90%] h-[400px] md:w-[700px] md:h-[600px]"
                alt=""
              />
            </div>
            <button
              className="absolute top-0 right-2 text-4xl m-4 text-white"
              onClick={() => setShowModal(false)}
            >
              x
            </button>
          </div>
        )}
        {openGroupDetails ? (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedGroup?.name}</h2>
                <IoMdClose
                  className="text-xl cursor-pointer"
                  onClick={() => {
                    setOpenGroupDetails(false);
                  }}
                />
              </div>
              <div className="mt-4 overflow-y-auto max-h-72">
                <p className="text-gray-600">Members:</p>
                <ul className="mt-2 space-y-2">
                  {selectedGroup?.participants.map((member) =>
                    user._id != member._id ? (
                      <li
                        key={member._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <img
                            src={member.avatar}
                            alt={member.username}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div className="">
                            <div className="">{member.username}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {user.friends.includes(member._id) ? (
                            <FiUserCheck className="text-lg text-green-600" />
                          ) : (
                            <div
                              onClick={() => {
                                sendRequest({
                                  recipientId: member._id,
                                  senderId: user._id,
                                });
                              }}
                              className="text-lg cursor-pointer"
                            >
                              <IoMdPersonAdd />
                            </div>
                          )}
                          {user._id === selectedGroup.admin._id && (
                            <button
                              className="ml-2 text-red-500 hover:text-red-600 focus:outline-none"
                              onClick={() => {
                                removeMember(member._id);
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
              {user._id === selectedGroup?.admin._id && (
                <div className="my-4 text-sm">
                  <label htmlFor="members" className="block mb-1">
                    Add Members:
                  </label>
                  <Select
                    isMulti
                    name=""
                    onChange={(options) => {
                      const selectedValues = options.map(
                        (option) => option.value
                      );
                      setSelectedMembers(selectedValues);
                    }}
                    options={friends
                      .filter(
                        (friend) =>
                          !selectedGroup?.participants.some(
                            (participant) => participant._id === friend._id
                          )
                      )
                      .map((filteredFriend) => ({
                        label: filteredFriend.username,
                        value: filteredFriend._id,
                      }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />

                  <button
                    onClick={() => {
                      addMembers();
                    }}
                    className="bg-blue-500 px-3 py-2 text-white rounded mt-4"
                  >
                    Add
                  </button>
                </div>
              )}
              {user._id === selectedGroup?.admin._id && (
                <div className="text-center mt-4">
                  <button
                    className="text-red-500 hover:text-red-600 focus:outline-none rounded py-2 px-3"
                    onClick={() => {
                      deleteGroup();
                    }}
                  >
                    Delete Group
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {isLogoutOpen ? (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow">
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded shadow mr-2"
                  onClick={() => {
                    navigate("/login");
                    dispatcher(logout({}));
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
        <div className="min-h-full bg-gray-100 flex flex-col justify-between">
          <div className="flex-grow min-h-full">
            <div className="min-h-full">
              <div className="bg-white shadow-sm px-3 py-3 lg:px-6 items-center justify-between flex sticky top-0">
                <div
                  onClick={() => {
                    setOpenGroupDetails(true);
                  }}
                  className="text-2xl font-semibold flex items-center gap-2 w-[70%] cursor-pointer"
                >
                  <img
                    src={selectedGroup?.avatar}
                    className="w-12 h-12 rounded-full"
                    alt=""
                  />
                  <div className="font-semibold text-xl w-full">
                    {selectedGroup?.name}
                    <div className="truncate text-sm text-gray-500 font-normal">
                      {selectedGroup &&
                        selectedGroup.participants?.map((member, index) => (
                          <>
                            <span key={index}>
                              {member.username}
                              {index == selectedGroup.participants.length - 1
                                ? ""
                                : ","}{" "}
                            </span>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 relative md:hidden">
                  <FaUser
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="cursor-pointer text-lg"
                  />
                  <MdOutlineNotificationAdd
                    onClick={() => {
                      setShowNotification(true);
                    }}
                    className="cursor-pointer text-xl"
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
                    onClick={() => setToggle(true)}
                    className={`absolute text-sm font-bold text-white bg-green-600 right-[-4px] top-[-5px] rounded-full px-[7px] py-[2px] ${
                      newGroupMessage.length + newMessage.length == 0
                        ? "hidden"
                        : ""
                    }`}
                  >
                    {newGroupMessage.length + newMessage.length}
                  </div>
                </div>
              </div>
              {groupChat == null && (
                <div
                  role="status"
                  className={`w-full h-full flex mt-28 justify-center`}
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
              <div className={`w-full mx-auto p-2 md:pt-6 md:px-6`}>
                <div className="flex flex-col h-full">
                  {groupChat?.length == 0 ? (
                    <div className="w-full mt-32 flex justify-center text-2xl font-semibold items-center">
                      <div className="">Start Chatting</div>
                    </div>
                  ) : (
                    groupChat?.map((msg, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            msg.sender._id == user._id
                              ? "bg-green-400 self-end text-black"
                              : "bg-blue-500 self-start text-white"
                          } p-2 px-3 rounded-lg mb-2`}
                        >
                          <div className="flex flex-col">
                            {msg.attachment && (
                              <div
                                className="cursor-pointer mb-1"
                                onClick={() =>
                                  handleClick(
                                    API_BASE_URL + "/" + msg.attachment
                                  )
                                }
                              >
                                <img
                                  src={API_BASE_URL + "/" + msg.attachment}
                                  width={250}
                                  height={200}
                                  alt=""
                                />
                              </div>
                            )}
                            <span>{msg.content}</span>
                            <div className="text-right text-[10px]">
                              {formatTimeFromTimestamp(msg.timestamp)}
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
          {/* Message input form */}
          <div className="sticky bottom-2 w-full">
            <form
              encType="multipart/form-data"
              onSubmit={submitHandler}
              className="flex items-center rounded-lg px-2 gap-1"
            >
              <label
                htmlFor="file"
                className={`px-3 py-3 bg-gray-300 rounded cursor-pointer ${
                  fileAdded ? "bg-green-400" : ""
                }`}
              >
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="hidden"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={handleChange}
                />
                <GrAttachment />
              </label>
              <input
                type="text"
                name="text"
                placeholder="Type your message..."
                className="px-4 py-2 focus:outline-none rounded w-full shadow-lg border border-gray-400"
              />
              <button
                type="submit"
                disabled={isDisabled}
                className="px-4 py-3 bg-blue-500 text-white cursor-pointer font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <IoSendSharp />
              </button>
            </form>
          </div>
        </div>
      </>
    )
  );
}

export default Group;
