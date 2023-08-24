import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentChatUser, setAllContactsPage } from '@/store/slice/authSlice';

import Avatar from '../common/Avatar';

const ChatListItem = ({data, isContactPage = false}) => {
  const dispatch = useAppDispatch();
  const { userInfo, currentChatUser } = useAppSelector(state => state.auth);

  const handleContactClick = () => {
    /*if (currentChatUser?.id === data?.id) {
    }*/
    dispatch(setCurrentChatUser(data));
    dispatch(setAllContactsPage());
  }

  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover relative flex-none h-[72px]`}
      onClick={handleContactClick}
    >
      <div className='flex flex-none justify-center w-[74px]'>
        <div className="flex rounded-full bg-[#00a884] w-[48px] h-[48px] justify-center items-center">
          <span>
            <Avatar type="lg" image={data?.avatar} />
          </span>
        </div>
      </div>

      <div className='flex min-h-full flex-col justify-center pr-2 w-full border-b border-conversation-border'>
        <div className='flex justify-between'>
          <div>
            <span className='text-white'>{data?.username}</span>
          </div>
        </div>
        <div className='flex pb-2 pt-1 p3-2'>
          <div className='flex justify-between w-full'>
            <span className='text-secondary line-clamp-1 text-sm'>{data?.about || "\u00A0"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatListItem;
