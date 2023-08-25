import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/calculateTime";
import { Message } from "@/types";
import WaveSurfer from "wavesurfer.js";

import Avatar from "../common/Avatar";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }: { message: Message }) {
  const { currentChatUser, userInfo } = useAppSelector((state) => state.auth);
  const [audioMessage, setAudioMessage] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformReady, setWaveformReady] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveform = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = WaveSurfer.create({
        container: waveformRef.current as HTMLDivElement,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
      });
      waveform.current.on("finish", () => {
        setIsPlaying(false);
      });
    }
    return () => {
      waveform.current!.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = `${process.env.NEXT_PUBLIC_API_URL}/uploads/audios/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
    setWaveformReady(true);
    waveform.current!.load(audioURL);
    waveform.current!.on("ready", () => {
      setTotalDuration(waveform.current!.getDuration());
    });
  }, [message.message]);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current!.stop();
      waveform.current!.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (audioMessage) {
      waveform.current!.stop();
      audioMessage.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md    ${
        message.sender_id === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div>
        <Avatar type="lg" image={currentChatUser?.avatar} />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveformRef} />
        <div className="text-bubble-meta text-[11px] pt-1  flex justify-between absolute bottom-[-22px] w-full ">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.created_at)}</span>
            {message.sender_id === userInfo.id && (
              <MessageStatus messageStatus={message.message_status} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
