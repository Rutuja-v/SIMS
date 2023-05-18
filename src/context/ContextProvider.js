import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem("user")) ?? null
  );

  useEffect(() => {
    if (state !== null) {
      axios
        .get(`http://ec2-100-26-21-150.compute-1.amazonaws.com/api/employees/${state.id}`)
        .then(response => {
          const loginUser = {
            id: response.data.id,
            name: response.data.name,
            username: response.data.username,
            role: response.data.role.role,
            godown: response.data.godown,
          };
          setState(loginUser);
          localStorage.setItem("user", JSON.stringify(loginUser));
        })
        .catch(error => console.log({ data: error.response.data, status: error.response.status }))
    }
  }, []);

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};
export default ContextProvider;
