import { useAppContext } from "../context/AppContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import AccessTime from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import toast from "react-hot-toast";

const Connection = () => {
  const { authFetch, users, user, usersIndex } = useAppContext();
  const [connections, setConnections] = useState(null);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [profile, setProfile] = useState({});
  const { id } = useParams();
  const getConnections = async () => {
    const tId = toast.loading("Getting Connections🌚");
    try {
      const response = await authFetch.get(`/connection/getAllByUserId/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const responseConnections = response.data.connections;
        setConnections(responseConnections);
      }
      toast.success("Connections Fetched!!", { id: tId });
    } catch (error) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
  };
  const getProfile = () => {
    const tId = toast.loading("Getting Connections🌚");
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
  const getMutual = async () => {
    const tId = toast.loading("Finding Mutual Connections🌚");
    try {
      const response = await authFetch.get(`/connection/findMutual/${id}`, {
        withCredentials: true,
      });
      setMutualConnections(response.data.mutualFriends);
      toast.success("Mutual Connection Fetched!!✌️", { id: tId });
    } catch (err) {
      toast.error("Something Went Wrong!!", { id: tId });
    }
  };
  useEffect(() => {
    toast.dismiss();
    getConnections();
    getMutual();
    getProfile();
  }, [users, usersIndex]);
  return (
    <Stack textAlign={"center"} marginTop="30px">
      <Box
        padding={"10px"}
        textAlign={"center"}
        marginTop={"45px"}
        display={"flex"}
        margin={"auto"}
        justifyContent={"space-between"}
      >
        <Typography
          display={"inline"}
          variant="h4"
          color={"black"}
          fontWeight={"bold"}
          borderBottom={"3px solid purple"}
        >
          {`${profile?.displayName}'s Connections`}
        </Typography>
      </Box>
      <Stack
        display={"flex"}
        flexDirection={"row"}
        flexWrap={"wrap"}
        justifyContent={"space-around"}
        marginTop={"50px"}
        alignItems={"center"}
        gap={"20px"}
        paddingX={"10px"}
      >
        {connections?.map((connection) => (
          <Box width="350px" key={user.email} style={{}}>
            <Card
              sx={{
                maxWidth: 345,
                paddingY: "20px",
                paddingX: "10px",
                background: "white",
                borderRadius: "5%",
                boxShadow: "none",
              }}
            >
              <CardMedia
                style={{
                  width: "100px",
                  margin: "auto",
                  borderRadius: "50%",
                }}
                sx={{ height: "100px" }}
                image={
                  id !== connection.person1
                    ? users[usersIndex[connection.person1]]?.image
                      ? users[usersIndex[connection.person1]]?.image
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3GDXNIHPQ5hgFL5l788XFv2UNLuDkNoHdVRmFcXPqyAhSb9Bw3c_RuxjoEJB46Lsgl-w&usqp=CAU"
                    : users[usersIndex[connection.person2]]?.image
                    ? users[usersIndex[connection.person2]]?.image
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3GDXNIHPQ5hgFL5l788XFv2UNLuDkNoHdVRmFcXPqyAhSb9Bw3c_RuxjoEJB46Lsgl-w&usqp=CAU"
                }
                title={user?.displayName}
              />
              <CardContent>
                <Stack display={"flex"} gap={"20px"}>
                  {connection.person1 !== user._id &&
                  connection.person2 !== user._id ? (
                    <Stack>
                      <Typography fontSize={"1.2rem"}>
                        {connection.person1 === id
                          ? users[usersIndex[connection.person2]]?.displayName
                          : users[usersIndex[connection.person1]]?.displayName}
                      </Typography>
                      <Typography color={"purple"} fontWeight={"bold"}>
                        {!(
                          connection.person1 === user._id &&
                          connection.person2 === id
                        ) &&
                          !(
                            connection.person2 === user._id &&
                            connection.person1 === id
                          ) &&
                          mutualConnections.filter(
                            (m) =>
                              m === connection.person1 ||
                              m === connection.person2
                          ).length > 0 &&
                          "Mutual Connection"}
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack>
                      <Typography
                        color={"purple"}
                        fontWeight={"bold"}
                        fontSize={"1.2rem"}
                      >
                        {id !== connection.person1
                          ? users[usersIndex[connection.person1]]?.displayName
                          : users[usersIndex[connection.person2]]?.displayName}
                      </Typography>
                      <Typography color={"purple"} fontWeight={"bold"}>
                        Your Connection
                      </Typography>
                    </Stack>
                  )}

                  <Typography
                    bgcolor={"rgba(210, 92, 249, 0.2)"}
                    display={"inline"}
                    padding={"10px 20px"}
                    borderRadius={"10px"}
                  >
                    {" "}
                    {users[usersIndex[connection.person1]]?.displayName} is{" "}
                    {connection.relation} of{" "}
                    {users[usersIndex[connection.person2]]?.displayName}
                  </Typography>
                  {!connection.isVerified ? (
                    <Typography color={"purple"}>{<AccessTime />}</Typography>
                  ) : (
                    <Typography color={"purple"}>
                      <VerifiedIcon />
                    </Typography>
                  )}
                  <Link
                    style={{ border: "none" }}
                    to={`/profile/${
                      connection.person1 === id
                        ? users[usersIndex[connection.person2]]?._id
                        : users[usersIndex[connection.person1]]?._id
                    }`}
                  >
                    <Button style={{ background: "purple", color: "white" }}>
                      View Profile
                    </Button>
                  </Link>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default Connection;
