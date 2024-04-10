import { useEffect, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTime from "@mui/icons-material/AccessTime";
import { useAppContext } from "../context/AppContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Button, InputBase, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Edit from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
const Profile = () => {
  const { authFetch, users, user } = useAppContext();
  const [connectionCount, setConnectionCount] = useState(0);
  const [connection, setConnection] = useState(null);
  const [profile, setProfile] = useState({});
  const [relation, setRelation] = useState("");
  const { id } = useParams();

  const getConnectionCount = async (tId) => {
    try {
      const response = await authFetch.get(
        `/connection/getConnectionCount/${id}`,
        { withCredentials: true }
      );
      setConnectionCount(response.data.count);
      toast.success("Connection Count Fetched!!", { id: tId });
    } catch (error) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
  };
  const getConnection = async (tId) => {
    try {
      const response = await authFetch.get(
        `/connection/getConnectionByUserId/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setConnection(response.data.connection);
      }
      toast.success("Connection Data Fetched!!", { id: tId });
    } catch (err) {
      if (err.response.status === 404) {
        toast.error("You don't have connection!!", { id: tId });
      } else {
        toast.error("Something Went Wrong!!", { id: tId });
      }
    }
  };
  const handleConnection = async () => {
    const tId = toast.loading("Making Connection 🌚");
    try {
      await authFetch.post(
        `/connection/create`,
        {
          person2Id: id,
          relation,
        },
        { withCredentials: true }
      );
      toast.success("Connection Created 🌜", { id: tId });
    } catch (err) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
    window.location.reload();
    getConnection();
  };

  const handleVerify = async () => {
    const tId = toast.loading("Verifying Connection 🌚");
    try {
      await authFetch.get(`/connection/verify/${connection.id}`, {
        withCredentials: true,
      });
      toast.success("Connection Verified 🫡", { id: tId });
    } catch (err) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
    window.location.reload();

    getConnection();
  };

  const handleRemove = async () => {
    const tId = toast.loading("Removing Connection 🥲");
    try {
      await authFetch.delete(`/connection/remove/${connection.id}`, {
        withCredentials: true,
      });
      toast.success("Connection Removed 🫡", { id: tId });
    } catch (err) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
    window.location.reload();
    getConnection();
  };

  const getProfile = (tId) => {
    try {
      const filteredProfile = users.filter((user) => user._id === id);
      setProfile(filteredProfile[0]);
      if (filteredProfile[0]) {
        toast.success("Profile Fetched!!", { id: tId });
      } else {
        toast.error("No Profile Found!!", { id: tId });
      }
    } catch (err) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
  };
  useEffect(() => {
    toast.dismiss();
    const tId1 = toast.loading("Gathering Connection Count...🫡");
    const tId3 = toast.loading("Getting User data...😊");
    getConnectionCount(tId1);
    if (id !== user._id) {
      const tId2 = toast.loading("Finding Your Connection...");
      getConnection(tId2);
    }
    getProfile(tId3);
  }, [users, id]);

  return (
    <Stack textAlign={"center"}>
      <Box
        padding={"10px"}
        textAlign={"center"}
        margin={"auto"}
        marginTop={"25px"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Typography
          display={"inline"}
          variant="h4"
          color={"black"}
          fontWeight={"bold"}
          borderBottom={"3px solid purple"}
        >
          {profile?.displayName}
        </Typography>
      </Box>
      <Stack
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-around"}
        marginTop={"20px"}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          textAlign={"left"}
          gap={"15px"}
        >
          <Box display={"flex"} flexDirection={"row"} gap="10px">
            <Typography variant="h6" color={"purple"} fontWeight={"bold"}>
              {profile?.displayName}
              {"       "}
            </Typography>
            <Link to={`/update/${id}`}>
              <Typography variant="h6" color={"purple"} fontWeight={"bold"}>
                {profile?._id === user?._id ||
                (profile?.createdBy === user._id && !profile?.isVerified) ? (
                  <Edit />
                ) : (
                  ""
                )}
              </Typography>
            </Link>
          </Box>
          <Typography variant="h6">{profile?.email}</Typography>

          {profile?.occupation && (
            <>
              <Typography variant="h6">
                Occupation: {profile?.occupation}
              </Typography>
            </>
          )}

          {profile?.city && (
            <>
              <Typography variant="h6">City: {profile?.city}</Typography>
            </>
          )}
          {profile?.state && (
            <>
              <Typography variant="h6">State: {profile?.state}</Typography>
            </>
          )}
          {profile?.country && (
            <>
              <Typography variant="h6">Country: {profile?.country}</Typography>
            </>
          )}

          <Link to={`/connections/${profile?._id}`}>
            <Button style={{ background: "purple", color: "white" }}>
              <Typography variant="h7">{`${connectionCount} Connection`}</Typography>
            </Button>
          </Link>
          {id !== user._id && connection && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              marginTop={"50px"}
              gap={"5px"}
              paddingY="10px"
              paddingX="15px"
              bgcolor={"rgba(210, 92, 249, 0.7)"}
              borderRadius={"20px"}
            >
              {connection.person2 === user._id && !connection.isVerified && (
                <Typography
                  fontSize={"1.2rem"}
                  color={"purple"}
                  sx={{ marginTop: "1px" }}
                  fontWeight={"bold"}
                >
                  Request:{" "}
                </Typography>
              )}
              <Typography
                fontSize={"1.2rem"}
                alignItems={"center"}
                sx={{ marginTop: "2px" }}
              >
                {connection.person1 === profile?._id
                  ? `${profile?.displayName} Is Your ${connection?.relation}`
                  : `You're ${connection?.relation} of ${profile?.displayName}`}
              </Typography>
              {connection?.verified ? (
                <Typography color={"purple"}>
                  <VerifiedIcon />
                </Typography>
              ) : (
                connection.person2 !== user._id &&
                !connection.isVerified && (
                  <Typography color={"purple"}>
                    {
                      <AccessTime
                        sx={{ marginTop: "5px", marginLeft: "8px" }}
                      />
                    }
                  </Typography>
                )
              )}
              {connection.person2 === user._id && !connection.isVerified && (
                <Button
                  style={{
                    minHeight: 0,
                    minWidth: 0,
                    padding: 0,
                    marginLeft: "8px",
                  }}
                  onClick={handleVerify}
                >
                  <CheckCircleIcon
                    sx={{
                      color: "green",
                    }}
                  />
                </Button>
              )}
              <Button
                onClick={handleRemove}
                style={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: 0,
                  marginLeft: "15px",
                }}
              >
                <ClearIcon sx={{ color: "red" }} />
              </Button>
            </Box>
          )}

          {id !== user._id && !connection && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              textAlign={"left"}
              justifyItems={"left"}
              marginTop={"50px"}
              gap={"5px"}
            >
              <Typography variant="h6">No Connections Yet</Typography>
              <InputBase
                sx={{
                  flex: 1,
                  border: "2px solid purple",
                  borderRadius: "10px",
                  padding: "7px",
                }}
                inputProps={{ "aria-label": "search google maps" }}
                vvalue={relation}
                onChange={(e) => {
                  setRelation(e.target.value);
                }}
              />
              <Button
                sx={{
                  background: "purple",
                  color: "white",
                  "&:hover": { backgroundColor: "purple" },
                }}
                onClick={() => {
                  handleConnection();
                }}
              >
                Make Connection
              </Button>
            </Box>
          )}
        </Box>
        <Box
          style={{
            width: "400px",
            height: "400px",
            borderRadius: "50%",
          }}
        >
          <img
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            src={
              profile?.image
                ? profile?.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3GDXNIHPQ5hgFL5l788XFv2UNLuDkNoHdVRmFcXPqyAhSb9Bw3c_RuxjoEJB46Lsgl-w&usqp=CAU"
            }
          ></img>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Profile;
