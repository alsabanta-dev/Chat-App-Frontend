import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import { useState, useContext } from "react"
import { Socket, io } from "socket.io-client"
import axios from 'axios'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import ImageViewer from 'react-simple-image-viewer';
import ReactPlayer from 'react-player'
import MessageModel from '../interfaces/MessageModel'
import Message from './Message'
import SendFile from './SendFile'
import { ThemeContext } from '../App'
import { usePopper } from 'react-popper'
import Spinner from './Spinner'
import BaseReactPlayer from 'react-player/base'
import { left } from '@popperjs/core'



interface Props {
  user: Object | undefined,
  conversation: Object | undefined,
  updateConversationList: () => Promise<void>
}

function Conversation({user, conversation, updateConversationList}: Props) {

  const {theme} = useContext(ThemeContext)

  const messagesContainerRef:React.RefObject<HTMLDivElement> = React.createRef()
  const noMessagesHolderRef:React.RefObject<HTMLDivElement> = React.createRef()
  const fileInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  
  const [emojiPickerRef, setEmojiPickerRef] = useState(null)
  const [emojiPickerPopoverRef, setEmojiPickerPopoverRef] = useState(null)
  const [arrowElement, setArrowElement] = useState(null);
  
  const [attachFileMenuRef, setAttachFileMenuRef] = useState(null)
  const [attachFileMenuPopoverRef, setAttachFileMenuPopoverRef] = useState(null)

  const [voiceRecorderRef, setVoiceRecorderRef] = useState(null)
  const [voiceRecorderPopoverRef, setVoiceRecorderPopoverRef] = useState(null)

  setAttachFileMenuRef
  setAttachFileMenuPopoverRef

  const [file, setFile] = useState(null)

  const messagesBuffer: MutableRefObject<MessageModel[]> = useRef([])

  const [messages, setMessages] = useState(messagesBuffer.current)

  const [contactStatus, setContactStatus] = useState('') 
  
  const [loadingMessages, setLoadingMessages] = useState(true) 
  
  const  conversationSocketRef  = useRef<Socket>()
  useEffect(() => {
    // console.log('Conversation', conversation)
    if(conversation){
      updateConversationList()
      conversationSocketRef.current = io(`http://localhost:2000/conversation`, {
        forceNew: true,
        extraHeaders: {
          userid: user._id,
          conversationid: conversation._id,
          username: user.userName
        }
      })

      conversationSocketRef.current.on('connect', () => {
        // console.log(`Connected with Id ${conversationSocketRef.current!.id}`)
        setContactStatus(contact.status)
      })
    
      conversationSocketRef.current.on('receive-message', (message) => {
        console.log('✉️ Message Received:', message)
        addMessage(message, 'received')
      })
    
      conversationSocketRef.current.on('change-status', (status) => {
        console.log('Status:', status)
        setContactStatus(status)
      })

      axios.get(`${import.meta.env.VITE_SERVER_URL}/messages/conversation/${conversation._id}`)
      .then(res => {
        // console.log('Old messages success: ',res)
        const oldMessages:Array<MessageModel> = []
        res.data.messages.forEach(message => {
          const oldMessage = {
            message: message.message,
            date: message.date,
            dir: message.sender == user._id? 'sent' : 'received',
            file: message.file,
            type: message.type
          }
          oldMessages.push(oldMessage)
        })
        setMessages(oldMessages)
        messagesBuffer.current = oldMessages
        setLoadingMessages(false)
      }).catch(err => {
        console.log('Old messages error:', err)
      })

    }
    handleFileCancel()
  }, [conversation, user])

  const messageInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  
  async function sendMessage() {
    if(messageInputRef.current){
      const uploadedFile = await uploadFile()
      const message = messageInputRef.current.value
      if(message || uploadedFile){
        conversationSocketRef.current!.emit('send-message', message, uploadedFile)
        addMessage(message, 'sent')
        messageInputRef.current.value = ''
        handleFileCancel()
      }
    }
  }

  function onMessageInputFocus(){
    if(messageInputRef.current!.value.length > 0){
      conversationSocketRef.current!.emit('contact-status', 'Typing')
      // console.log('Message Input on focus')
    }
  }

  function onMessageInputFocusOut(){
    conversationSocketRef.current!.emit('contact-status', '')
    // console.log('Message Input on focus')
  }

  function onMessageInputKeyDown(event: KeyboardEvent){
    if(event.key == 'Enter'){
      if(messageInputRef.current?.value){
        sendMessage()
      }
    }
  }

  function onMessageInputKeyUp() {
    if(messageInputRef.current!.value.length > 0)
        conversationSocketRef.current!.emit('contact-status', 'Typing')
      else
        conversationSocketRef.current!.emit('contact-status', '')
  }

  function addMessage(message: string, dir: string="sent"){
    if(noMessagesHolderRef.current && noMessagesHolderRef.current.style.display != 'none') noMessagesHolderRef.current.style.display = 'none'
    
    const newMessage:MessageModel = {message, date: Date.now(), dir}
    setMessages([newMessage].concat(messages))
    messagesBuffer.current = [newMessage].concat(messagesBuffer.current)
    updateConversationList()
    // console.log('Messages', messages)
  }

  function openFilePicker(acceptType: string){
    if(fileInputRef.current){
      fileInputRef.current.accept = acceptType + '/*'
      fileInputRef.current.click()
    }
    toggleAttachFileMenu()
  }

  function handleFileChange(event){
    console.log('Files:', event.target.files)
    // fileContainerRef.current!.style.visibility = 'visible'
    const file = event.target.files[0]
    setFile(file)
  }

  function handleFileCancel(){
    setFile(null)
  }

  async function uploadFile(){
    if(file){
      const form = new FormData()
      form.append('file', file)
      try{
        const res = await axios(`${import.meta.env.VITE_SERVER_URL}/conversations/uploadFile`, {
          method: 'POST',
          data: form,
          withCredentials: true
        })
        console.log('res:', res)
        return {
          name: res.data.file.name, 
          type: res.data.file.type
        }
      }catch(err){
        console.log('err:', err)
        return null
      }
    }
  }

  const handleEmojiSelect = (emojiData) => {
    if(messageInputRef.current){
      if(messageInputRef.current.value)
        messageInputRef.current.value += emojiData.emoji
      else
        messageInputRef.current.value = `${emojiData.emoji}`
    }
  }

  // console.log(emojiPickerRef, emojiPickerPopoverRef)
  const { styles, attributes } = usePopper(emojiPickerRef, emojiPickerPopoverRef, {
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 5] } }
    ],
  })
  
  const attachFilePopper = usePopper(attachFileMenuRef, attachFileMenuPopoverRef, {
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 5] } }
    ],
  })

  const menuStyles = attachFilePopper.styles
  const menuAttributes = attachFilePopper.attributes

  // const voiceRecorderPopper = usePopper(voiceRecorderRef, voiceRecorderPopoverRef, {
  //   modifiers: [
  //     { name: 'arrow', options: { element: arrowElement } },
  //     { name: 'offset', options: { offset: [0, 5] } }
  //   ],
  // })

  // const voiceRecorderStyles = voiceRecorderPopper.styles
  // const voiceRecorderAttributes = voiceRecorderPopper.attributes

  const toggleEmojiPicker = () => {
    const popover = document.getElementById('emojiPickerPopover')
    if(popover){
      popover.style.visibility = popover.style.visibility == 'hidden'?'visible':'hidden'
    }
  }

  const toggleAttachFileMenu = () => {
    const popover = document.getElementById('attachFileMenu')
    if(popover){
      popover.style.visibility = popover.style.visibility == 'hidden'?'visible':'hidden'
    }
  }

  // const toggleVoiceRecorder = () => {
  //   const popover = document.getElementById('voiceRecorder')
  //   if(popover){
  //     popover.style.visibility = popover.style.visibility == 'hidden'?'visible':'hidden'
  //   }
  // }

  // document.onblur = (e) => {
  //   toggleEmojiPicker('hide')
  //   toggleAttachFileMenu('hide')
  // }

  // document.onfocus = () => {
  //   toggleEmojiPicker('show')
  //   toggleAttachFileMenu('show') 
  // }

  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const images = []

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index)
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setCurrentImage(0)
    setIsViewerOpen(false)
  }

  const [currentVideo, setCurrentVideo] = useState(0)
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const videos = []

  const openVideoPlayer = useCallback((index) => {
    setCurrentVideo(index)
    setIsVideoPlayerOpen(true)
  }, [])

  const closeVideoPlayer = () => {
    setCurrentVideo(0)
    setIsVideoPlayerOpen(false)
  }

  // const repositionVideoPlayer = () => {
  //   setTimeout(() => {
  //     const videoPlayer = document.getElementById('video-player')
  //     console.log('video-player', videoPlayer)
  //     if(videoPlayer){
  //       console.log('Here')
  //       const videoPlayerCopy = videoPlayer
  //       videoPlayer.parentElement!.removeChild(videoPlayer)
  //       document.getElementById('root')!.appendChild(videoPlayerCopy)
  //     }
  //   }, 1000)
  //   return true
  // }

  const contact = conversation? conversation.parties.find(party => party._id != user._id) : null
  return (
    conversation?
      (<div className="d-flex flex-column bg-theme bg-conversation" style={{height: '100%'}}>
        {/* Contact */}
        <div className="d-flex px-3 py-2 bg-accent divider-bottom">
          <div className="row justify-content-start align-items-center" style={{flexGrow: 1}}>
            <div className="col-auto d-sm-none">
              <i role='button' className="fa fa-arrow-left" aria-hidden="true"></i>
            </div>
            <div className="col-auto">
              <img className='avatar' src={`http://127.0.0.1:3000/img/users/${contact.photo}`} alt={`Photo of ${contact.firstName}`} />
            </div>
            <div className="col">
              <div className="d-flex flex-column">
                <span className='text-primary fw-semibold small truncate'>{`${contact.firstName} ${contact.lastName}`}</span>
                <span className='smaller'>{contactStatus}</span>
              </div>
            </div>
            <div className='col-auto d-none d-md-block'>
              <div className="smaller">@{contact.userName}</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} id="messagesContainer" className="scrollable d-reverse pt-3 px-1" style={{flexGrow: 1}}>
          {
            loadingMessages?
              <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{height: '100%'}}>
                <Spinner content='Loading messages'/>
              </div>
            :
              messages && messages.length > 0?
                <ul id='messagesList' className='list-unstyled d-reverse'>
                  {
                    messagesBuffer.current.map((message: MessageModel, index: number) => {
                      let imageIndex = -1
                      let videoIndex = -1
                      if(message.type == 'image'){
                        images.push(`http://127.0.0.1:3000/storage/conversations/images/${message.file}`)
                        imageIndex = images.length - 1
                      }else if(message.type == 'video'){
                        videos.push(`http://127.0.0.1:3000/storage/conversations/videos/${message.file}`)
                        videoIndex = videos.length - 1
                      }
                      return (<li key={index} 
                        onClick={() => {
                          if(message.type == 'image'){
                            openImageViewer(imageIndex)
                          }else if(message.type == 'video'){
                            openVideoPlayer(videoIndex)
                          }
                        }}>
                        <Message message={message.message} dir={message.dir} date={message.date} type={message.type} file={message.file}/>
                      </li>
                    )})
                  }
                </ul>
              :
                <div ref={noMessagesHolderRef} className="d-flex flex-column justify-content-center align-items-center text-center" style={{height: '100%'}}>
                  {/* <i className="fa fa-envelope text-primary mb-4" style={{scale: '3'}}/> */}
                  <div className="logo mb-3" style={{scale: '1.5'}}/>
                  <h5>No Messages Yet, <strong>Start chatting now!</strong></h5>
                </div>
          }
        </div>

        {/* File container */}
        <SendFile file={file} onFileCancel={handleFileCancel}/>

        {/* Send message */}
        <div className="d-flex justify-content-start align-items-center px-3 py-3 bg-accent text-muted divider-top">
          <div ref={setAttachFileMenuRef} role="button" className="send-button" title='Send files' onClick={toggleAttachFileMenu}><i className="fas fa-paperclip"></i></div>
          <input ref={fileInputRef} type="file" onChange={handleFileChange} hidden/>
          
          <div className='menu' id='attachFileMenu' ref={setAttachFileMenuPopoverRef} style={{...menuStyles.popper, visibility: 'hidden'}} {...menuAttributes.popper}>
            <div className='menu-item' onClick={() => openFilePicker('image')}>
              <i className='fa fa-image fa-sm me-2'/> Image
            </div>
            <div className='menu-item' onClick={() => openFilePicker('video')}>
              <i className='fa fa-video fa-sm me-2'/> Video
            </div>
            <div className='menu-item' onClick={() => openFilePicker('')}>
              <i className='fa fa-file fa-sm me-2'/> Document
            </div>
          </div>


          <div ref={setEmojiPickerRef} role="button" className="mx-2 send-button" onClick={toggleEmojiPicker}><i className="fas fa-smile"></i></div>
          
          <div id='emojiPickerPopover' ref={setEmojiPickerPopoverRef} style={{...styles.popper, visibility: 'hidden'}} {...attributes.popper}>
            <EmojiPicker height='45vh' width='30vw' onEmojiClick={handleEmojiSelect} emojiStyle={EmojiStyle.NATIVE} previewConfig={{showPreview: false}} lazyLoadEmojis skinTonesDisabled theme={theme=='dark'?Theme.DARK:Theme.LIGHT}/>
            {/* Whatever Anything */}
            <div ref={setArrowElement} style={styles.arrow} />
          </div>

          <input ref={messageInputRef} type="text" className="form-control bg-theme" placeholder="Type message" onFocus={onMessageInputFocus} onBlur={onMessageInputFocusOut} onKeyDown={onMessageInputKeyDown} onKeyUp={onMessageInputKeyUp}/>
          
          {/* <i ref={setVoiceRecorderRef} onClick={toggleVoiceRecorder} role='button' className="fa fa-microphone ms-3 send-button" aria-hidden="true"/>

          <div id='voiceRecorder' ref={setVoiceRecorderPopoverRef} style={{...voiceRecorderStyles.popper, visibility: 'hidden'}} {...voiceRecorderAttributes}>
            <div className='d-flex align-items-center bg-dark px-3 py-1' style={{borderRadius: '0.5rem', border: 'var(--color-divider-dark) 1px solid' }}>
              <i className='fa fa-play me-3' role='button'/>
              <div className='timer me-4'>00:00</div>
              <i className='fa fa-microphone' role='button'/>
            </div>
            <div ref={setArrowElement} style={styles.arrow} />
          </div> */}

          <div role="button" className="send-button ms-3" onClick={sendMessage}><i className="fas fa-paper-plane"></i></div>
        </div>

        {isViewerOpen && (
          <ImageViewer
            src= {images}
            currentIndex= {currentImage}
            disableScroll= {true}
            closeOnClickOutside= {true}
            onClose= {closeImageViewer}
            backgroundStyle= {{padding: '2rem', background: 'rgba(0,0,0, 0.9)'}}
          />
        )}

        {isVideoPlayerOpen && (
          <div id="video-player" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100vh', width: '100vw', background: 'rgba(0,0,0,0.9)', top: 0, left: 0, zIndex: 999, marginLeft: 'calc(100% - 100vw)'}}>
            <ReactPlayer url={videos[currentVideo]} volume={1} controls={true} style={{minHeight: '100%', minWidth: '100%', padding: '2rem'}}/>
            <button style={{position: 'absolute', right: '1rem', top: '1rem'}} className='button-close' onClick={closeVideoPlayer}><i className="fa fa-times fa-2x"/></button>
          </div>
        )}

      </div>)
    :
      <div className="d-flex flex-column justify-content-center align-items-center text-center bg-theme" style={{height: '100%'}}>
        {/* <i className="btn-icon fa fa-message text-primary mb-5" title="Chat app" aria-hidden="true" style={{scale: '4'}}></i> */}
        <div className="logo mb-5" style={{scale: '2.5'}}/>
        <h3 className='m-0'>Welcome to <strong>Chat App</strong></h3>
        <p className='text-primary'>Fun & easy way to stay connected with your friends</p>
      </div>
  )
}

export default Conversation