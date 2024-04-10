import { useEffect, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import SearchIcon from "@mui/icons-material/Search";
import { useAppContext } from "../context/AppContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
const Home = () => {
  const { users, user: loggedInUser } = useAppContext();
  const [searchParams, setSearchParams] = useState("");

  useEffect(() => {}, [users]);

  return (
    <Stack>
      <Box
        padding={"10px"}
        textAlign={"center"}
        marginTop={"15px"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Typography width={"27%"} />
        <Typography
          display={"inline"}
          variant="h4"
          color={"black"}
          width={"33%"}
          fontWeight={"bold"}
          borderBottom={"3px solid purple"}
        >
          Users
        </Typography>
        <Paper
          width={"33%"}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ "aria-label": "search google maps" }}
            value={searchParams}
            onChange={(e) => {
              setSearchParams(e.target.value);
            }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        flexDirection={"row"}
        justifyContent={"space-around"}
        gap={"20px"}
        marginY={"25px"}
        marginX={"25px"}
      >
        {users
          ?.filter((user) => {
            for (let key in user) {
              const value = user[key];
              if (typeof value === "string") {
                if (
                  user[key].toLowerCase().includes(searchParams) &&
                  user._id !== loggedInUser._id
                ) {
                  return true;
                }
              }
            }

            return false;
          })
          .map((user) => {
            return (
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
                      user?.image
                        ? user?.image
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3GDXNIHPQ5hgFL5l788XFv2UNLuDkNoHdVRmFcXPqyAhSb9Bw3c_RuxjoEJB46Lsgl-w&usqp=CAU"
                    }
                    title={user?.displayName}
                  />
                  <CardContent>
                    <Stack display={"flex"} gap={"10px"}>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        marginTop={"20px"}
                        gap={"5px"}
                      >
                        <Typography color={"purple"} fontSize={"1.2rem"}>
                          {user.displayName}
                        </Typography>
                        <Typography color={"purple"}>
                          {user.isVerified && <VerifiedIcon />}
                        </Typography>
                      </Box>
                      <Typography>{user.email}</Typography>
                      <Link
                        style={{ border: "none" }}
                        to={`/profile/${user._id}`}
                      >
                        <Button
                          style={{ background: "purple", color: "white" }}
                        >
                          View Profile
                        </Button>
                      </Link>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
      </Box>
    </Stack>
  );
};

export default Home;
