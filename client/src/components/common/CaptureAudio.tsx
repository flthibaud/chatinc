import React, { useState, SetStateAction, Dispatch, useRef, useEffect } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addMessage } from "@/store/slice/messageSlice";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";

interface CaptureAudioProps {
  hide: Dispatch<SetStateAction<boolean>>;
}

const CaptureAudio = ({ hide }: CaptureAudioProps) => {
  const dispatch = useAppDispatch();
  const { userInfo, currentChatUser } = useAppSelector((state) => state.auth);
  const { socket } = useAppSelector((state) => state.socket);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(null);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const [recordingDiration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState<Blob | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration: number) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current as HTMLDivElement,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
    });
    setWaveform(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) {
      handleStartRecording();
    }
  }, [waveform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current!.srcObject = stream;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setRecordedAudio(audio);

        if (waveform) {
          waveform.load(audioURL);
        }
      };

      mediaRecorder.start();
    }).catch((error) => {
      console.log("Error accessing microphone :", error);
    });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (waveform) {
        waveform.stop();
      }

      const audioChunks: BlobPart[] = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event: BlobEvent) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform!.stop();
      waveform!.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    if (recordedAudio) {
      waveform!.pause();
      recordedAudio.pause();
      setIsPlaying(false);
    }
  };

  const sendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio as Blob);
      const response = await axios.post(`/api/messages/sent-audio-message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      });
      if (response.status === 200) {
        socket.current.emit("send-msg", response.data);
        dispatch(addMessage(response.data));
        hide(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon cursor-pointer"
          onClick={() => hide(false)}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            Recording <span>{recordingDiration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone className="text-red-500" onClick={handleStartRecording} />
        ) : (
          <FaPauseCircle className="text-red-500" onClick={handleStopRecording} />
        )}
      </div>
      <div>
        <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send" onClick={sendRecording} />
      </div>
    </div>
  );
};

export default CaptureAudio;
