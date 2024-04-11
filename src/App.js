import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Chat from "./Components/Chat";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useContext, useEffect } from "react";
import { MainContext } from "./Context/Main";

function App() {
  const { localToState } = useContext(MainContext);
  useEffect(() => {
    localToState();
  }, []);
  const routes = createBrowserRouter([
    {
      path: "",
      element: <MainPage />,
      children: [
        {
          path: "/",
          element: <Chat />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
