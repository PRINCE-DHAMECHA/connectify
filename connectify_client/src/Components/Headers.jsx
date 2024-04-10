import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import ExploreIcon from "@mui/icons-material/Explore";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Stack, Typography } from "@mui/material";
import { routes } from "../utils/routes";
import LoginIcon from "@mui/icons-material/Login";
import toast, { Toaster } from "react-hot-toast";
import HomeIcon from "@mui/icons-material/Home";

const Headers = () => {
  const { user, setUser, setUsers, authFetch, setUsersIndex, isChange } =
    useAppContext();
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const getUser = async () => {
    const tId = toast.loading("Finding Users...🫡");

    try {
      const response = await axios.get("http://localhost:5000/login/sucess", {
        withCredentials: true,
      });
      setUser(response.data.user);
      const response2 = await authFetch.get(`/user/search/`, {
        withCredentials: true,
      });
      const { resUser } = response2.data;
      let indexUsers = {};
      for (let i = 0; i < resUser.length; i++) {
        indexUsers[resUser[i]._id] = i;
      }
      setUsersIndex(indexUsers);
      setUsers(resUser);
      if (response2.data.resUser) {
        toast.success(`${resUser.length} Users Found!!😉`, { id: tId });
      }
    } catch (error) {
      navigate("/login");
      toast.error(`Something Went Wrong`, { id: tId });
    }
  };
  const logout = () => {
    window.open("http://localhost:5000/logout", "_self");
  };

  const handleHover = () => {
    setIsHover((prev) => !prev);
  };

  useEffect(() => {
    getUser();
  }, [isChange]);
  return (
    <Stack>
      <Toaster position="top-center" reverseOrder={false} />
      <Box sx={{ position: "fixed", top: "20px", left: "20px" }}>
        {Object?.keys(user)?.length > 0 ? (
          <Box>
            <Link to={`/profile/${user._id}`}>
              <Typography>
                <img
                  src={user?.image}
                  style={{ width: "50px", borderRadius: "50%" }}
                  alt=""
                />
              </Typography>
            </Link>
          </Box>
        ) : (
          <Typography
            border={"2px solid purple"}
            padding={"10px"}
            borderRadius={"100%"}
            width={"35px"}
            height={"35px"}
            bgcolor={"purple"}
          >
            <NavLink to="/login">
              <LoginIcon
                sx={{
                  display: "block",
                  margin: "3px",
                  marginTop: "6px",
                  color: "white",
                }}
              />
            </NavLink>
          </Typography>
        )}
      </Box>
      {isHover && (
        <Stack
          sx={{
            position: "fixed",
            bottom: "90px",
            right: "90px",
            background: "purple",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <Stack display={"flex"} gap="10px">
            {routes.map((route) => (
              <Link
                key={route.name}
                onClick={handleHover}
                to={route.path}
                style={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <Typography fontSize="1.2rem" key={"route.name"}>
                  {route.name}
                </Typography>
              </Link>
            ))}
            <Link
              onClick={logout}
              to={"/login"}
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "black",
              }}
            >
              <Typography fontSize="1.2rem" color="white">
                {user?.displayName ? "Logout" : "Login"}
              </Typography>
            </Link>
          </Stack>
        </Stack>
      )}
      <Box
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        onClick={handleHover}
      >
        <Typography>
          {!isHover ? (
            <ExploreIcon
              sx={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                color: "purple",
              }}
            />
          ) : (
            <ClearIcon
              sx={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                color: "purple",
              }}
            />
          )}
        </Typography>
      </Box>
      <Box style={{ position: "fixed", bottom: "20px", left: "20px" }}>
        <Link to={user?.displayName ? "/" : "/login"}>
          <Typography>
            <HomeIcon
              sx={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                color: "purple",
              }}
            />
          </Typography>
        </Link>
      </Box>
    </Stack>
  );
};

export default Headers;
