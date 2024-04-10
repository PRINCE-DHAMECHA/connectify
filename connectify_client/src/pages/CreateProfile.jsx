import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const CreateProfile = () => {
  const { setIsChange } = useAppContext();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    const tId = toast.loading("Crunching Profile🫣");
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user/createProfile",
        { profile: formData },
        { withCredentials: true }
      );
      toast.success("Profile Created✌️", { id: tId });
      setIsChange((prev) => !prev);
      navigate(`/profile/${response.data.resUser?._id}`);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.msg, { id: tId });
      } else {
        toast.error("Something Went Wrong🥲", { id: tId });
      }
    }
  };
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    occupation: "",
    state: "",
    country: "",
    city: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {}, []);
  return (
    <Stack>
      <Box
        padding={"10px"}
        textAlign={"center"}
        marginTop={"25px"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Typography
          display={"inline"}
          variant="h4"
          color={"black"}
          width={"33%"}
          fontWeight={"bold"}
          borderBottom={"3px solid purple"}
        >
          Create Profile
        </Typography>
      </Box>
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{
          margin: "auto",
          width: "20rem",
          textAlign: "center",
          paddingTop: "30px",
        }}
      >
        <TextField
          label="Name"
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ m: 1 }}
          fullWidth
          onChange={handleChange}
          value={formData.displayName}
          name="displayName"
        />
        <TextField
          label="Email"
          required
          variant="outlined"
          color="secondary"
          type="email"
          sx={{ m: 1 }}
          fullWidth
          value={formData.email}
          onChange={handleChange}
          name="email"
        />
        <TextField
          label="City"
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ m: 1 }}
          fullWidth
          value={formData.city}
          onChange={handleChange}
          name="city"
        />
        <TextField
          label="State"
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ m: 1 }}
          fullWidth
          value={formData.state}
          onChange={handleChange}
          name="state"
        />
        <TextField
          label="Country"
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ m: 1 }}
          fullWidth
          value={formData.country}
          onChange={handleChange}
          name="country"
        />
        <TextField
          label="Occupation"
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ m: 1 }}
          fullWidth
          value={formData.occupation}
          onChange={handleChange}
          name="occupation"
        />
        <Button
          variant="outlined"
          color="secondary"
          type="submit"
          sx={{ marginTop: "20px" }}
        >
          Create
        </Button>
      </form>
    </Stack>
  );
};

export default CreateProfile;
