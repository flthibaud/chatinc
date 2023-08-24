import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { MdGroup } from "react-icons/md";
import { useAppDispatch } from "@/store/hooks";
import { setAllContactsPage } from "@/store/slice/authSlice";
import axios from "axios";
import ChatListItem from "./ChatListItem";

const ContactsList = () => {
  const dispatch = useAppDispatch();
  const [allContacts, setAllContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTJS_SITE_URL}/api/user/contacts`
        );

        setAllContacts(users);
      } catch (error) {
        console.log(error);
      }
    };

    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => dispatch(setAllContactsPage())}
          />
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div>
              <input
                type="text"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                placeholder="Search Contacts"
              />
            </div>
          </div>
        </div>

        <div>
          <div
            className={`flex cursor-pointer items-center hover:bg-background-default-hover relative flex-none h-[72px]`}
          >
            <div className='flex flex-none justify-center w-[74px]'>
              <div className="flex rounded-full bg-[#00a884] w-[48px] h-[48px] justify-center items-center">
                <span>
                  <MdGroup className="text-[#e9edef] cursor-pointer text-lg w-[24px] h-[24px]" />
                </span>
              </div>
            </div>

            <div className='flex min-h-full flex-col justify-center pr-2 w-full'>
              <div className='flex justify-between'>
                <div>
                  <span className='text-white'>Nouveau Groupe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.entries(allContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">
                {initialLetter}
              </div>
              {userList.map((contact) => {
                return (
                  <ChatListItem key={contact.id} data={contact} isContactPage />
                )
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactsList;
