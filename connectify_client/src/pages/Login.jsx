import { Button, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self");
  };
  return (
    <Stack
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-evenly"}
      alignItems={"center"}
      height={"95vh"}
    >
      <Button
        sx={{
          alignItems: "center",
          textAlign: "center",
          marginTop: "4px",
          border: "2px solid purple",
          padding: "10px",
          color: "purple",
          display: "flex",
          gap: "10px",
        }}
        onClick={loginWithGoogle}
      >
        <GoogleIcon />
        <Typography color={"black"}>Sign In With Google</Typography>
      </Button>
    </Stack>
  );
};

export default Login;
