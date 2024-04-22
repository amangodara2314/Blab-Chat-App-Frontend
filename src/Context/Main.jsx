import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import socket from "../utils/socket";
import {
  logout,
  lsToState,
  lstoStateGroupMessages,
  setNewGroupMessage,
  setSelectedGroup,
} from "../Reducers/user";
import { store } from "../store";
export const MainContext = createContext();

function Main(props) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const USER_URL = process.env.REACT_APP_USER_URL;
  const FRIEND_URL = process.env.REACT_APP_FRIEND_URL;
  const CHAT_URL = process.env.REACT_APP_CHAT_URL;
  const GROUP_URL = process.env.REACT_APP_GROUP_URL;

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
  const [createGroup, setCreateGroup] = useState(false);
  const [groups, setGroups] = useState(null);
  const [newGroup, setNewGroup] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [groupChat, setGroupChat] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [openGroupDetails, setOpenGroupDetails] = useState(false);

  const { user, selectedGroup, newGroupMessage } = useSelector(
    (store) => store.user
  );

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
    const lsTab = JSON.parse(localStorage.getItem("activeTab"));
    const lsGroup = JSON.parse(localStorage.getItem("group"));
    const groupNoti = JSON.parse(localStorage.getItem("groupMessages"));

    if (lschat != null) {
      setSelectedChat(lschat);
    }
    if (lsMsg != null) {
      setNewMessage(lsMsg);
    }
    if (lsTab != null) {
      setActiveTab(lsTab);
    }
    if (lsGroup != null) {
      dispatcher(setSelectedGroup({ g: lsGroup }));
    }
    if (groupNoti != null) {
      dispatcher(lstoStateGroupMessages({ notify: groupNoti }));
    }
    dispatcher(lsToState({ user: lsuser }));
  };
  const fetchGroups = (userId) => {
    axios
      .get(API_BASE_URL + GROUP_URL + "get-group/" + userId)
      .then((success) => {
        setGroups(success.data.group);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    localToState();
  }, []);

  useEffect(() => {
    if (user) fetchGroups(user._id);
  }, [user, selectedGroup]);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(selectedChat));
    localStorage.setItem("group", JSON.stringify(selectedGroup));
    localStorage.setItem("newMessage", JSON.stringify(newMessage));
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
  }, [selectedChat, newMessage, activeTab, selectedGroup]);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMembers.length == 0) {
      return;
    }
    const data = {
      name: groupName,
      admin: user._id,
      avatar: `https://api.multiavatar.com/${groupName}.png`,
      participants: [...selectedMembers, user._id],
    };
    axios
      .post(API_BASE_URL + GROUP_URL + "create-group", data)
      .then((success) => {
        if (success.data.status == 1) {
          fetchGroups(user._id);
          e.target.reset();
          setCreateGroup(false);
          socket.emit("new-group", {
            members: selectedMembers,
            group: data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getChat = () => {
    axios
      .get(API_BASE_URL + GROUP_URL + "get-chat/" + selectedGroup._id)
      .then((success) => {
        if (success.data.status == 1) {
          setGroupChat(success.data.group.groupMessages);
        }
      })
      .catch((err) => console.log(err));
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
        groups,
        setGroups,
        handleSubmit,
        friends,
        localToState,
        CHAT_URL,
        sendMessageNotification,
        setNewMessage,
        setSelectedGroup,
        newMessage,
        activeTab,
        setActiveTab,
        toggle,
        setToggle,
        getChat,
        setShowNotification,
        showNotification,
        setSelectedChat,
        selectedChat,
        handleLogout,
        setIsLogoutOpen,
        isLogoutOpen,
        createGroup,
        setCreateGroup,
        GROUP_URL,
        fetchGroups,
        setNewGroup,
        newGroup,
        setGroupChat,
        groupChat,
        groupName,
        setGroupName,
        setSelectedMembers,
        setOpenGroupDetails,
        openGroupDetails,
        selectedMembers,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}

export default Main;
