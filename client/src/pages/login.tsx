import React from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function login() {

  const handleLogin = () => {
    //window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/google-signin`;
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/google-signin`, "_self");
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="Whatsapp" width={300} height={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Sign in with Google</span>
      </button>
    </div>
  );
}

export default login;
