"use client";
import { User } from "lucia";
import React, { createContext, useContext } from "react";

export const UserDetailsContext = createContext<User>({
  id: "",
  role: "staff",
  username: "",
  displayname: "",
  testRole: undefined,
  email: "",
});

export const UserDetailsProvider = ({
  children,
  details,
}: {
  children: React.ReactNode;
  details: User;
}) => {
  // const { testRole, ...others } = details;
  // const formattedDetails = {
  //   ...others,
  //   role: testRole ?? details.role,
  // };
  details.role = details.testRole ?? details.role;
  return (
    <UserDetailsContext.Provider value={details}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetailsContext = () => useContext(UserDetailsContext);
