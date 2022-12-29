import { useContext, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import OthersProfile from "./pages/user/OthersProfile";
import OtpSection from "./components/user/OtpSection";
import { AvoidLogdUser, UserAuth } from "./components/user/UserAuth";
import { GlobalContext } from "./Context/Global";
import { getRequest } from "./helper/HandleRequest";
import Connect from "./pages/user/Connect";
import IndexPage from "./pages/user/IndexPage";
import Jobs from "./pages/user/Jobs";
import Login from "./pages/user/Login";
import Messages from "./pages/user/Messages";
import Profile from "./pages/user/Profile";
import SignUp from "./pages/user/SignUp";
import UserFeed from "./pages/user/UserFeed";

function App() {
  const { setloggedUser } = useContext(GlobalContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      getRequest(`/getUser/${user._id}`).then((res) => {
        setloggedUser(res.returnedValue);
      });
    }
    console.log("app useff");
  }, [setloggedUser]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<AvoidLogdUser />}>
            <Route element={<IndexPage />} path="/" />
            <Route element={<Login />} path="/login" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<OtpSection />} path="/otp" />
          </Route>

          <Route element={<UserAuth />}>
            <Route element={<UserFeed />} path="/feed" />
            <Route element={<Connect />} path="/connect" />
            <Route element={<OthersProfile />} path="/user/:userId" />
            <Route element={<Jobs />} path="/jobs" />
            <Route element={<Messages />} path="/messages" />
            <Route element={<Profile />} path="/profile" />
            {/* <Route path="/notifications" /> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
