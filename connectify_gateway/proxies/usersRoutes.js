const userRoutes = [
  {
    url: "/user/signIn",
    auth: false,
  },
  {
    url: "/user/createProfile",
    auth: true,
  },
  {
    url: "/user/getOneByGoogleId/:googleId",
    auth: false,
  },
  {
    url: "/user/getOneByEmail/:email",
    auth: false,
  },
  {
    url: "/user/getOneById/:id",
    auth: false,
  },
  {
    url: "/user/updateProfile/:profileId",
    auth: true,
  },
  {
    url: "/user/deleteProfile/:profileId",
    auth: true,
  },
  {
    url: "/user/search",
    auth: false,
  },
];

module.exports = { userRoutes };
