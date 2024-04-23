import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { setSelectedGroup } from "../Reducers/user";

const Removed = () => {
  const { selectedGroup } = useSelector((store) => store.user);
  const dispatcher = useDispatch();
  useEffect(() => {
    dispatcher(setSelectedGroup({ g: null }));
  }, []);
  return (
    <div style={styles.container}>
      <h2>You've been removed from the group</h2>
      <p>
        We're sorry, but you have been removed from this group or the group has
        been deleted. You can return to the home page by clicking the button
        below.
      </p>
      <Link to="/" style={styles.button}>
        Return to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    marginTop: "20px",
  },
};

export default Removed;
