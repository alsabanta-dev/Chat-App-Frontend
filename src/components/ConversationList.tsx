import { RefObject, createRef, useState } from "react"
import { dateFormat } from "../utils/utils"
import MessageContainer from "./MessageContainer"
import Spinner from "./Spinner"

interface Props {
  conversations: Array<Object>,
  onConversationSelect: (conversation: Object) => void,
  onNewConversationClick: any,
  user: Object | undefined,
  loadingState: boolean
}
function ConversationList({conversations, onConversationSelect, onNewConversationClick, user, loadingState}: Props) {

  const [searchMode, setSearchMode] = useState(false)
  const [conversationsSearchResult, setConversationsSearchResult] = useState([])
  const searchInputRef:RefObject<HTMLInputElement> = createRef()

  const searchInConversations = () => {
    if(searchInputRef.current){
      const searchQuery = searchInputRef.current.value.trim().toLowerCase()
      if(searchQuery != ''){
        if(!searchMode) setSearchMode(true)
      }else{
        setSearchMode(false)
      }
      const searchResult = conversations.filter(conversation => {
        const contact = conversation.parties.find(party => party._id != user._id)
        return contact.name.toLowerCase().includes(searchQuery) || contact.userName.toLowerCase().includes(searchQuery)
      })
      setConversationsSearchResult(searchResult)
      // console.log('Search result:', searchResult)
    }
  }

  return (
    <div className="d-flex flex-column" style={{height: '100%'}}>

      <div className="main-container-title">Conversations</div>

      <div className="input-group rounded mb-1 bg-accent">
        <input type="search" ref={searchInputRef} onKeyUp={searchInConversations} className="form-control bg-accent rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon"/>
        <span className="input-group-text border-0" id="search-addon">
          <i className="fas fa-search"/>
        </span>
      </div>

      {
        loadingState?
          <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{height: '100vh'}}>
            <Spinner content='Loading conversations'/>
          </div>
        :
          conversations && conversations.length > 0?
            <div className="scrollable"  style={{flexGrow: 1}}>
              {
                !searchMode?
                  <ul className="list-unstyled mb-0">
                    {
                      conversations.map((conversation: Object) => {
                        const contact = conversation.parties.find(party => party._id != user._id)
                        return (
                          <li className={`p-2 mb-1 ${conversation.selected? 'select-conversation' : null}`} key={conversation._id}>
                            <div role="button" className="d-flex justify-content-between" onClick={() => {onConversationSelect(conversation)}}> 
                              <div className="d-flex flex-row">
                                <div>
                                  <img src={`http://127.0.0.1:3000/img/users/${contact.photo}`} alt="avatar" className="d-flex align-self-center me-3 circular" width="60"/>
                                  {/* <span className={`badge bg-${contact.status?'success':'danger'} badge-dot`}></span> */}
                                </div>
                                <div className="pt-1">
                                  <div className="fw-bold mb-0 truncate">{contact.name}</div>
                                  <div className="small text-muted">
                                    {
                                      conversation.latestMessage?
                                        conversation.latestMessage.type == 'text'?
                                            conversation.latestMessage.message
                                          :
                                            (<div>
                                              <i className={`fa fa-sm fa-${conversation.latestMessage.type == 'document'?'file':conversation.latestMessage.type}`}></i> {
                                                conversation.latestMessage.message?
                                                  conversation.latestMessage.message
                                                :
                                                  conversation.latestMessage.type.toUpperCase()
                                              }
                                            </div>)
                                        :
                                          'No messages yet'
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="pt-1">
                                <div className="smaller text-muted mb-1">
                                  {conversation.latestMessage?
                                    dateFormat(conversation.latestMessage.createdAt):null
                                  }
                                </div>
                                {conversation.latestMessage && conversation.latestMessage.sender == contact._id && conversation.newMessagesCount?
                                  <span className="badge bg-primary rounded-pill float-end">{conversation.newMessagesCount}</span>:null
                                }
                              </div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                :(
                  conversationsSearchResult.length > 0?
                  <ul className="list-unstyled mb-0">
                  {
                    conversationsSearchResult.map((conversation: Object) => {
                      const contact = conversation.parties.find(party => party._id != user._id)
                        return (
                          <li className={`p-2 mb-1 ${conversation.selected? 'select-conversation' : null}`} key={conversation._id}>
                            <div role="button" className="d-flex justify-content-between" onClick={() => {onConversationSelect(conversation)}}> 
                              <div className="d-flex flex-row">
                                <div>
                                  <img src={`http://127.0.0.1:3000/img/users/${contact.photo}`} alt="avatar" className="d-flex align-self-center me-3 circular" width="60"/>
                                  {/* <span className={`badge bg-${contact.status?'success':'danger'} badge-dot`}></span> */}
                                </div>
                                <div className="pt-1">
                                  <div className="fw-bold mb-0 truncate">{contact.name}</div>
                                  <div className="small text-muted">
                                    {
                                      conversation.latestMessage?
                                        conversation.latestMessage.type == 'text'?
                                          conversation.latestMessage.message
                                        :
                                          (<div>
                                            <i className={`fa fa-sm fa-${conversation.latestMessage.type == 'document'?'file':conversation.latestMessage.type}`}></i> {
                                              conversation.latestMessage.message?
                                                conversation.latestMessage.message
                                              :
                                                conversation.latestMessage.type.toUpperCase()
                                            }
                                          </div>)
                                      :
                                        'No messages yet'
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="pt-1">
                                <div className="smaller text-muted mb-1">
                                  {conversation.latestMessage?
                                    dateFormat(conversation.latestMessage.createdAt):null
                                  }
                                </div>
                                {conversation.latestMessage && conversation.latestMessage.sender == contact._id && conversation.newMessagesCount?
                                  <span className="badge bg-primary rounded-pill float-end">{conversation.newMessagesCount}</span>:null
                                }
                              </div>
                            </div>
                          </li>
                        )
                      })
                  }
                </ul>
                  :
                    <MessageContainer state="notFound" mainContent='Search in conversations' notFoundContent='No results found' image='/img/chat.png' notFoundImage='/img/chat.png'/>
                )
                
              }
            </div>
          :
          <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100%'}}>
            <img src="/img/chat.png" style={{width: '45px'}}/>
            <button className="btn btn-primary btn-sm mt-1" onClick={onNewConversationClick}>Start conversation</button>
          </div>
      }
        

    </div>
  )
}

export default ConversationList