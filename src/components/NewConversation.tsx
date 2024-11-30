import axios from 'axios'
import {useState} from 'react'
import MessageContainer from './MessageContainer'

interface Props {
  onContactSelect: (contact: Object) => void
}

function NewConversation({ onContactSelect }: Props) {

  const [contacts, setContacts] = useState([]) 

  const delay = (ms:number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const onSearchInputChanged = async (event:KeyboardEvent) => {
    setState('loading')
    await delay(100)

    const query = (event.target as HTMLInputElement).value
    try{
      const getFilteredContactsRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users?search=${query}`)
      console.log(getFilteredContactsRes.data.users)
      setContacts(getFilteredContactsRes.data.users)
      if(getFilteredContactsRes.data.users.length == 0) setState('notFound')
    }catch(err){
      console.log('❌', err)
    }
  }

  const [state, setState] = useState('holder')

  return (<>
    <div className="d-flex flex-column scrollable" style={{height: '100%'}}>
      <div className="main-container-title">New conversation</div>
      
      <div className="input-group rounded mb-1 bg-accent">
        <input type="search" className="form-control bg-accent rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" onKeyUp={onSearchInputChanged}/>
        <span className="input-group-text border-0" id="search-addon">
          <i className="fas fa-search"></i>
        </span>
      </div>

      <div className="px-1" style={{height: '100%'}}>
        {contacts.length > 0?
          <ul className='list-unstyled'>
            {contacts.map(contact => 
              (<li className='border-bottom py-1' key={contact._id} role='button' onClick={() => {onContactSelect(contact);}}>
                <div className="row">
                  <div className="col-auto">
                    <img className='avatar' src={`http://127.0.0.1:3000/img/users/${contact.photo}`} alt={`Photo of ${contact.firstName}`} />
                  </div>
                  <div className="col">
                    <div className="row small text-primary fw-semibold truncate">
                      {`${contact.firstName} ${contact.lastName}`}
                    </div>
                    <div className="row small fw-semibold truncate">
                      @{contact.userName}
                    </div>
                  </div>
                </div>
                </li>)
                )}
            </ul>
            :
            <MessageContainer state={state} mainContent='Search for contact' notFoundContent='No contact found' image='/img/chat.png' notFoundImage='/img/chat.png'/>
          }
      </div>
    </div>

  </>)

}


export default NewConversation
