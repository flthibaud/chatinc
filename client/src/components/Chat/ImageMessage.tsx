import { calculateTime } from "@/utils/calculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import { useAppSelector } from "@/store/hooks";
import { Message } from "@/types";

function ImageMessage({ message }: { message: Message }) {
  const { currentChatUser, userInfo } = useAppSelector((state) => state.auth);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${message.message}`
  return (
    <div
      className={`p-1 rounded-lg ${
        message.sender_id === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="relative">
        <Image
          src={imageUrl}
          className="rounded-lg"
          alt="asset"
          height={300}
          width={300}
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.created_at)}
          </span>
          <span className="text-bubble-meta">
            {message.sender_id === userInfo.id && (
              <MessageStatus messageStatus={message.message_status} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageMessage;
