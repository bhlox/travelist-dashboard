"use client";
import { User } from "lucia";
import React, { createContext, useContext } from "react";

export const UserDetailsContext = createContext<User>({
  id: "",
  role: "staff",
  username: "",
});

export const UserDetailsProvider = ({
  children,
  details,
}: {
  children: React.ReactNode;
  details: User;
}) => {
  return (
    <UserDetailsContext.Provider value={details}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetailsContext = () => useContext(UserDetailsContext);
