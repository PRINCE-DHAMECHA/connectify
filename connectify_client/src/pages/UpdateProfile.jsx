import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const UpdateProfile = () => {
  const { users, setIsChange } = useAppContext();
  const [profile, setProfile] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tId = toast.loading("Crunching Profile🫣");
    try {
      await axios.put(
        `http://localhost:5000/user/updateProfile/${profile?._id}`,
        { profile: formData },
        { withCredentials: true }
      );
      toast.success("Profile Updated", { id: tId });
      setIsChange((prev) => !prev);
      window.location.reload();
    } catch (error) {
      toast.error("Something Went Wrong🥲", { id: tId });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const tId = toast.loading("Removing Profile🥲");
    try {
      await axios.delete(
        `http://localhost:5000/user/deleteProfile/${profile?._id}`,
        { withCredentials: true }
      );
      toast.success("Profile Removed🫣", { id: tId });
      setIsChange((prev) => !prev);
      navigate("/");
    } catch (error) {
      toast.error("Something Went Wrong🥲", { id: tId });
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
  useEffect(() => {
    const tId = toast.loading("Gathering Profile Details😎");
    const filteredProfile = users.filter((user) => user._id === id);
    setProfile(filteredProfile[0]);
    if (filteredProfile.length > 0) {
      setProfile(filteredProfile[0]);
      setFormData({ ...filteredProfile[0] });
      toast.dismiss();
      toast.success("Profile Data Gathered🌚", { id: tId });
    } else {
      setProfile({});
      setFormData({
        displayName: "",
        email: "",
        occupation: "",
        state: "",
        country: "",
        city: "",
      });
      toast.dismiss();
      toast.error("Can't Get Profile Data🥹", { id: tId });
    }
  }, [users, id]);
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
          Update Profile
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
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          gap={"10px"}
          margin={"20px"}
        >
          <Button variant="outlined" color="secondary" type="submit">
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            type="submit"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </form>
    </Stack>
  );
};

export default UpdateProfile;
