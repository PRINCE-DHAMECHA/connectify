import React, { useReducer, useContext, useState } from "react";

import axios from "axios";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [usersIndex, setUsersIndex] = useState({});
  const [isChange, setIsChange] = useState(false);
  const authFetch = axios.create({
    baseURL: "http://localhost:5000/",
  });

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        usersIndex,
        setUsersIndex,
        authFetch,
        isChange,
        setIsChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
