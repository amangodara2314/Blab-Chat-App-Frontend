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
import { store } from "../store";
import { useParams } from "react-router-dom";
import formatTimeFromTimestamp from "../utils/formatTime";
import socket from "../utils/socket";
import { setNewGroupMessage, setSelectedGroup } from "../Reducers/user";

function Group(props) {
  const {
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
  } = useContext(MainContext);

  const { user, selectedGroup, newGroupMessage } = useSelector(
    (store) => store.user
  );
  const messagesEndRef = useRef(null);
  const dispatcher = useDispatch();
  const { groupId } = useParams();
  const id = groupId;

  useEffect(() => {
    scrollToBottom();
  }, [groupChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (e.target.text.value != "") {
      axios
        .post(API_BASE_URL + GROUP_URL + "send-message/" + selectedGroup._id, {
          groupId: selectedGroup._id,
          sender: user._id,
          content: e.target.text.value,
        })
        .then((success) => {
          if (success.data.status == 1) {
            e.target.reset();
            const member = selectedGroup.participants.filter(
              (p) => p._id != user._id
            );
            dispatcher(setSelectedGroup({ g: success.data.popGroup }));
            getChat();

            socket.emit("groupMessageNotification", {
              group: selectedGroup,
              members: member,
            });
          } else {
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

  const handleGroupMessage = useCallback(
    (data) => {
      if (user) {
        fetchGroups(user._id);

        if (selectedGroup == null || data.group._id != selectedGroup?._id) {
          if (!newGroupMessage.includes(data.group._id)) {
            dispatcher(setNewGroupMessage({ group: data.group._id }));
            return;
          }
        }
        if (selectedGroup._id == data.group._id) {
          // console.log("in");
          // setGroupChat(data.group.groupMessages);
          getChat();
          return;
        }
      }
    },
    [socket]
  );

  useEffect(() => {
    socket.on("groupMessage", handleGroupMessage);

    return () => {
      socket.off("groupMessage", handleGroupMessage);
    };
  }, [socket, handleGroupMessage]);

  return (
    <div className="min-h-full bg-gray-100 flex flex-col justify-between">
      <div className="flex-grow min-h-full">
        <div className="min-h-full">
          <div className="bg-white shadow-sm px-3 py-3 lg:px-6 items-center justify-between flex sticky top-0">
            <div className="text-2xl font-semibold flex items-center gap-2 w-[70%]">
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
              <IoIosLogOut
                className="cursor-pointer text-xl"
                onClick={() => {
                  setIsLogoutOpen(true);
                }}
              />
              <FaUser className="cursor-pointer text-lg" />
              <MdOutlineNotificationAdd className="cursor-pointer text-xl" />
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
              <div className="absolute text-sm font-bold text-white bg-green-600 right-[-4px] top-[-5px] rounded-full px-[7px] py-[2px]">
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
                        <span>{msg.content}</span>
                        <div className="flex justify-between text-[10px] gap-2">
                          <div className="">by {msg.sender.username}</div>
                          <div className="">
                            {formatTimeFromTimestamp(msg.timestamp)}
                          </div>
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
          onSubmit={submitHandler}
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
  );
}

export default Group;
