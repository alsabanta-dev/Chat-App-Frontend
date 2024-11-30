import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Socket, io } from "socket.io-client"
import ConversationList from "../components/ConversationList";
import Conversation from "../components/Conversation";
import Sidebar from "../components/Sidebar";
import React, { useCallback } from 'react';
import {useEffect, useRef, useState } from 'react';
import NewConversation from '../components/NewConversation';
import MainContainer from '../components/MainContainer';
import Settings from '../components/Settings';

interface Props {
  user: Object | undefined,
  setUser: any
}

export default function Chat ({user, setUser}: Props){
  const CONVERSATION_LIST = 0
  const NEW_CONVERSATION = 1
  const SETTINGS = 2

  const socketRef = useRef<Socket>()

  // const navigate = useNavigate()

  const [mainContent, setMainContent] = useState(CONVERSATION_LIST)
  const [conversations, setConversations] = useState([])
  const [conversation, setConversation] = useState()
  const [loadingConversations, setLoadingConversations] = useState(true) 

  
  useEffect(() => {
    if(!conversations || conversations.length == 0 ) getConversations()
    if(!socketRef.current){
      socketRef.current = io(`http://localhost:2000/`, {
        extraHeaders: {
          userId: user._id
        }
      })
    
      socketRef.current.on('connect', () => {
        console.log(`🟢 Connected ${user.userName}`)    
      })
    
      socketRef.current.on('disconnect', () => {
        console.log(`🔴 disconnected ${user.userName}`)    
      })
    
      socketRef.current.on('update-conversations-list', (receiver) => {
        if(receiver == user._id) getConversations()
      })
    }
  })

  const handleConversationSelect = (conversation: Object) => {
    
    const conversationList = conversations.map(conversationItem => {
      conversationItem.selected = conversationItem._id == conversation._id
      return conversationItem
    })

    setConversations(conversationList)
    for(let party of conversation.parties){
      socketRef.current!.emit('get-user-status', party._id, (status) => {
        // console.log('get user status:', status)
        party.status = status
      })
    }
    setConversation(conversation)
  }

  const handleContactSelect = async (contact: Object) => {
    try{
      const res = await axios(`${import.meta.env.VITE_SERVER_URL}/conversations`, {
        method: 'POST',
        data: {
          parties: [user._id, contact._id]
        }
      })

      console.log('✔️', res)
      getConversations()
      setConversation(res.data.conversation)
    }catch(err){
      console.log('❌', err)
    }
  }

  const gotoNewConversation = () => {
    setMainContent(NEW_CONVERSATION)
  }

  const getConversations = async () => {
    // TODO: Fix bug the function is called twice
    try{
      const getConversationsRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/conversations/user/${user._id}`)
      // console.log('✔️', getConversationsRes)
      const conversationList = getConversationsRes.data.conversations
      if(conversation){
        conversationList.map(conversationItem => {
          conversationItem.selected = conversationItem._id == conversation._id
          return conversationItem
        })
      }
      // console.log('Conversations:', conversationList)
      // console.log('Selected:', conversation)
      setConversations(conversationList)
    }catch(err){
      console.log('❌', err)
    }finally{
      setLoadingConversations(false)
    }
  }

  return (<>
    <div className="d-flex" id="chat3">   
      {/* User */}
      <div className="col-auto divider-right">
        <Sidebar user={user} setMainContent={setMainContent} mainContent={mainContent}/>
      </div>

      <div className="col">
        <div className="d-flex">
          {/* Conversation List */}
          <div className="col-md-6 col-lg-5 col-xl-4 vh-100 pt-3 pb-1 px-3 divider-right" style={{minWidth: '250px'}}>
            {mainContent == CONVERSATION_LIST?
              <MainContainer content={<ConversationList conversations={conversations} onConversationSelect={handleConversationSelect} onNewConversationClick={gotoNewConversation} user={user} loadingState={loadingConversations}/>}/>
              :
              mainContent == NEW_CONVERSATION?
                <MainContainer content={<NewConversation onContactSelect={handleContactSelect}/>} />
                :
                mainContent == SETTINGS?
                  <MainContainer content={<Settings user={user} setUser={setUser}/>} />
                  :
                  null
            }
          </div>
          
          {/* Conversation */}
          <div className="col-md-6 col-lg-7 col-xl-8 vh-100" style={{background: 'var(--conversation-bg)'}}>
            <Conversation user={user} conversation={conversation} updateConversationList={getConversations}/>
          </div>
        </div>
      </div>

    </div>
  </>)


}
