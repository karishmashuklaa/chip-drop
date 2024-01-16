"use client";

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { User as UserType } from "@/types";
import { userList } from "@/data";
import Container from "@/components/Container";
import UserSearch from "@/components/Search";
import UserList from "@/components/User";
import Image from "next/image";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>(userList);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<UserType[]>(userList);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<null | number>(
    null
  );

  useEffect(() => {
    setMatchedUsers(users);
  }, [users]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      setBackspaceCount((prevCount) => prevCount + 1);
      if ((backspaceCount + 1) % 2 === 0) {
        setSelectedUsers((prevUsers) => prevUsers.slice(0, -1));
      } else {
        setLastSelectedIndex(selectedUsers.length - 1);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setMatchedUsers(users);
    } else {
      const matched = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setMatchedUsers(matched);
    }
    setDropdownOpen(value.trim() !== "");
  };

  const handleUserAction = (user: UserType, action: "add" | "remove") => {
    if (action === "add") {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      setMatchedUsers((prevMatchedUsers) =>
        prevMatchedUsers.filter((u) => u.id !== user.id)
      );
    } else {
      const updatedUserList = selectedUsers.filter((u) => u.id !== user.id);
      setUsers((prevState) => [...prevState, user]);
      setSelectedUsers(updatedUserList);
    }
    setSearchQuery("");
    setDropdownOpen(true);
  };

  const handleRemove = (removedUser: UserType) => {
    handleUserAction(removedUser, "remove");
  };

  return (
    <Container className="relative flex flex-col items-center gap-10 m-4">
      <h1 className="text-4xl font-bold text-blue-600">Pick Users</h1>
      <div className="wrapper w-full border-b-4 border-blue-600 bg-transparent pt-2 pb-2 font-sans">
        <ul className="flex flex-wrap gap-6">
          <UserList
            users={selectedUsers}
            handleRemove={handleRemove}
            lastSelectedIndex={lastSelectedIndex}
          />
          <UserSearch
            inputValue={searchQuery}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            isDropdownOpen={isDropdownOpen}
            filteredUsers={matchedUsers}
            handleUserAction={handleUserAction}
            setDropdownOpen={setDropdownOpen}
          />
        </ul>
      </div>
    </Container>
  );
}