import React from 'react';
import ChatlistHeader from './ChatlistHeader';
import SearchBar from './SearchBar';
import List from './List';

const Chatlist = () => {
  return (
    <div className='bg-panel-header-background flex flex-col max-h-screen z-20'>
      <>
        <ChatlistHeader />
        <SearchBar />
        <List />
      </>
    </div>
  )
}

export default Chatlist;