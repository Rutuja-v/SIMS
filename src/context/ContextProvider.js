import React, { useState } from "react";
import { createContext } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem("user")) ?? null
  );

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};
export default ContextProvider;
