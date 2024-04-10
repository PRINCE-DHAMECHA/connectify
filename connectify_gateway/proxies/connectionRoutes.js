const connectionRoutes = [
  {
    url: "/connection/create",
    auth: true,
  },
  {
    url: "/connection/create",
    auth: true,
  },
  {
    url: "/connection/getAll/:userId",
    auth: true,
  },
  {
    url: "/connection/getAllByUserId/:userId",
    auth: true,
  },
  {
    url: "/connection/getAllPending/:userId",
    auth: true,
  },
  {
    url: "/connection/verify/:connectionId",
    auth: true,
  },
  {
    url: "/connection/remove/:connectionId",
    auth: true,
  },
  {
    url: "/connection/update/:connectionId",
    auth: true,
  },
  {
    url: "/connection/delete/:connectionId",
    auth: true,
  },
  {
    url: "/connection/findMutual/:person2Id",
    auth: true,
  },
  {
    url: "/connection/getConnectionCount/:userId",
    auth: true,
  },
  {
    url: "/connection/getConnectionByUserId/:userId",
    auth: true,
  },
];

module.exports = { connectionRoutes };
