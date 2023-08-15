import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

import ChatlistHeader from "./ChatlistHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import ContactsList from "./ContactsList";

const Chatlist = () => {
  const { contactsPage } = useAppSelector((state) => state.auth);
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {pageType === "default" && (
        <>
          <ChatlistHeader />
          <SearchBar />
          <List />
        </>
      )}

      {pageType === "all-contacts" && (
        <ContactsList />
      )}
    </div>
  );
};

export default Chatlist;
