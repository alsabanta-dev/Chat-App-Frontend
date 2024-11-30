import React from 'react'
import { useNavigate } from 'react-router-dom'
import {MDBBtn,MDBContainer,MDBRow,MDBCol,MDBCard,MDBCardBody,MDBInput,MDBIcon} from 'mdb-react-ui-kit';
import axios from 'axios'

interface Props {
  setUser: React.Dispatch<React.SetStateAction<undefined>>
}

function Login({setUser}: Props) {

  const navigate = useNavigate()
  const userNameInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const passwordInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const loginBtnRef:React.RefObject<HTMLAllCollection> = React.createRef()

  const onLoginBtnClicked = async () => {
    if(!(userNameInputRef.current && userNameInputRef.current.value) || !(passwordInputRef.current && passwordInputRef.current.value)){
      return alert('All fields are required')
    }

    const data = {
      userName: userNameInputRef.current.value,
      password: passwordInputRef.current.value
    }

    try{
      const res = await axios(`${import.meta.env.VITE_SERVER_URL}/users/login`,{
        method: 'POST',
        data,
        withCredentials: true
      })
      // console.log('✔️', res)
      setUser(res.data.data.user)
      navigate('/')
    }catch(err){
      if(err.response && err.response.data) alert(err.response.data.message)
      console.log('❌', err)
    }

  }

  window.onkeydown = (event: KeyboardEvent) => {
    if(event.key == 'Enter'){
      // console.log('User name input focus:', userNameInputRef.current?.ariaFocus)
      // console.log('Password input focus:', passwordInputRef.current?.ariaFocus)

      if(userNameInputRef.current?.ariaFocus)
        return passwordInputRef.current?.focus()
      if(passwordInputRef.current?.ariaFocus && passwordInputRef.current.value)
        loginBtnRef.current?.click()
    }
  }

  window.onload = () => {
    userNameInputRef.current?.focus()
  }

  return (
    <div className='vh-100 d-flex justify-content-center align-items-center bg-theme bg-conversation'>

      <div className='d-flex flex-column align-items-center bg-accent' style={{padding: '3rem', borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
      <div className='brand'>
          <div className="logo brand-image my-3"/>
          <div className='brand-name'>Chat App</div> 
        </div>
        <h4 className="fw-bold mb-2 text-uppercase text-primary">Login</h4>
        <p className="mb-3">Please enter your login and password!</p>

        <input ref={userNameInputRef} className='form-control mb-2' placeholder='User name' type='text' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>
        <input ref={passwordInputRef} className='form-control mb-2' placeholder='Password' type='password' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>

        <div className='small mb-3 pb-lg-2 text-primary text-button' onClick={() => {navigate('#!')}}>Forgot password?</div>
        
        <button ref={loginBtnRef} className='btn btn-primary mb-4 w-100' size='lg' onClick={onLoginBtnClicked}>Login</button>
        <div>
          <div className="mb-0">Don't have an account? <span onClick={() => {navigate('/signup')}} className='fw-bold text-primary text-button'>Sign Up</span></div>
        </div>
      </div>


              
    </div>

  )
}

export default Login