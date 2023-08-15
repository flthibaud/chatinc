import React from "react";
import { useAppSelector } from "@/store/hooks";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

import Avatar from "../common/Avatar";

const ChatHeader = () => {
  const { currentChatUser } = useAppSelector((state) => state.auth);
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.avatar} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.username}</span>
          <span className="text-secondary text-sm">online/offline</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-panel-header-icon text-xl cursor-pointer" />
        <IoVideocam className="text-panel-header-icon text-xl cursor-pointer" />
        <BiSearchAlt2 className="text-panel-header-icon text-xl cursor-pointer" />
        <BsThreeDotsVertical className="text-panel-header-icon text-xl cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatHeader;
