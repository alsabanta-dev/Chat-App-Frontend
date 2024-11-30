import { RefObject, createRef, useEffect } from "react"
import axios from 'axios'
import Cookies from 'js-cookie'
import ToggleThemeButton from "./ToggleThemeButton"

interface Props{
  user: Object | undefined,
  mainContent: number | null,
  setMainContent: any,
}
export default function Sidebar({user, mainContent, setMainContent}: Props){
  
  const CONVERSATION_LIST = 0
  const NEW_CONVERSATION = 1
  const SETTINGS = 2

  const conversationsRef: RefObject<HTMLElement> = createRef()
  const newConversationRef: RefObject<HTMLElement> = createRef()
  const settingsRef: RefObject<HTMLElement> = createRef()

  const handleMainContentSelect = (mainContent: number) => {
    setMainContent(mainContent)
  }

  const onLogoutBtnClicked = async () => {
    try{
      Cookies.remove('jwt')
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, {withCredentials: true})
      console.log('✔️', res)
      // navigate('/')
      location.reload()
    }catch(err){
      console.log('❌', err)
    }
  }

  useEffect(() => {
    if(conversationsRef.current && newConversationRef.current && settingsRef.current){
      if(mainContent == CONVERSATION_LIST){
        if(conversationsRef.current && !conversationsRef.current.className.includes('active')) conversationsRef.current.className += ' active'
        if(newConversationRef.current) newConversationRef.current.className = newConversationRef.current.className.replace('active', '').trim()
        if(settingsRef.current) settingsRef.current.className = settingsRef.current.className.replace('active', '').trim()
      }
      else if(mainContent == NEW_CONVERSATION){
        if(newConversationRef.current && !newConversationRef.current.className.includes('active')) newConversationRef.current.className += ' active'
        if(conversationsRef.current) conversationsRef.current.className = conversationsRef.current.className.replace('active', '').trim()
        if(settingsRef.current) settingsRef.current.className = settingsRef.current.className.replace('active', '').trim()
      }
      else if(mainContent == SETTINGS) {
        if(settingsRef.current && !settingsRef.current.className.includes('active')) settingsRef.current.className += ' active'
        if(newConversationRef.current) newConversationRef.current.className = newConversationRef.current.className.replace('active', '').trim()
        if(conversationsRef.current) conversationsRef.current.className = conversationsRef.current.className.replace('active', '').trim()
      }
    }
  })

  return (
    <div className='bg-accent px-2 pt-4' style={{height: '100%'}}>
      <div className='d-flex flex-column align-items-center mx-1'>
        {/* App logo */}
        <div className="logo my-3" title="Chat app" data-bs-toggle="tooltip"/>

        <img className="avatar my-2 shadow" src={`http://127.0.0.1:3000/img/users/${user.photo}`} alt="avatar" data-bs-toggle="tooltip" title={`${user.firstName} ${user.lastName}`} style={{width: '35px', height: '35px', borderWidth: '2px', borderColor: 'rgb(13, 110, 253)', borderStyle: 'solid'}}/>

        <i ref={conversationsRef} className="btn-icon fa fa-message my-2 active" title="Conversations" aria-hidden="true" onClick={() => handleMainContentSelect(CONVERSATION_LIST)} data-bs-toggle="tooltip"/>
        <i ref={newConversationRef} className="btn-icon fa fa-plus my-2" title="New conversation" aria-hidden="true" onClick={() => handleMainContentSelect(NEW_CONVERSATION)} data-bs-toggle="tooltip"/>
        <i ref={settingsRef} className="btn-icon fa fa-cog my-2" title="Settings" aria-hidden="true" onClick={() => handleMainContentSelect(SETTINGS)} data-bs-toggle="tooltip"/>
        <ToggleThemeButton/>
        <i className="btn-icon fa fa-sign-out my-2" title="Logout" aria-hidden="true" onClick={onLogoutBtnClicked} data-bs-toggle="tooltip"/>
      </div>
    </div>
  )  
}

