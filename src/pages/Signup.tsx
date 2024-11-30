import React from 'react'
import { Routes , Route, useNavigate } from 'react-router-dom'
import {MDBBtn,MDBContainer,MDBRow,MDBCol,MDBCard,MDBCardBody,MDBInput,MDBIcon} from 'mdb-react-ui-kit';

import axios from 'axios'
import {AxiosError} from 'axios'

function Signup() {

  const navigate = useNavigate()
  const userNameInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const firstNameInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const lastNameInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const passwordInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const passwordConfirmInputRef:React.RefObject<HTMLInputElement> = React.createRef()
  const signupBtn:React.RefObject<HTMLAllCollection> = React.createRef()

  const onSignupBtnClicked = async () => {
    
    if(!(userNameInputRef.current && userNameInputRef.current.value) ||
      !(firstNameInputRef.current && firstNameInputRef.current.value) ||
      !(lastNameInputRef.current && lastNameInputRef.current.value) ||
      !(passwordInputRef.current && passwordInputRef.current.value) ||
      !(passwordConfirmInputRef.current && passwordConfirmInputRef.current.value)){
        return console.log('All feilds are required')
      }
    
    const data =  {
      userName: userNameInputRef.current.value,
      firstName: firstNameInputRef.current.value,
      lastName: lastNameInputRef.current.value,
      password: passwordInputRef.current.value,
      passwordConfirm: passwordConfirmInputRef.current.value
    }

    try{
      const res = await axios('http://127.0.0.1:3000/api/v1/users/signup', {
        method: 'POST',
        data,
        withCredentials: true
      })
  
      // alert(res.data.message)
      console.log('✔️', res.data)
      // TODO: Login automatically when signup successful
      navigate('/')
    }catch(err){
      if(err.response && err.response.data) alert(err.response.data.message)
      console.log('❌', err)
    }
  }


  window.onkeydown = (event: KeyboardEvent) => {
    if(event.key == 'Enter'){
      console.log('Enter clicked')
      // console.log('User name input focus:', userNameInputRef.current?.ariaFocus)
      // console.log('Password input focus:', passwordInputRef.current?.ariaFocus)

      // if(userNameInputRef.current?.ariaFocus)
      //   return passwordInputRef.current?.focus()
      // if(passwordInputRef.current?.ariaFocus && passwordInputRef.current.value)
      //   loginBtn.current?.click()
      if(firstNameInputRef.current?.ariaFocus) return lastNameInputRef.current?.focus()
      if(lastNameInputRef.current?.ariaFocus) return userNameInputRef.current?.focus()
      if(userNameInputRef.current?.ariaFocus) return passwordInputRef.current?.focus()
      if(passwordInputRef.current?.ariaFocus) return passwordConfirmInputRef.current?.focus()
      if(passwordConfirmInputRef.current?.ariaFocus) return signupBtn.current?.click()
    }
  }

  return (

    <div className='vh-100 d-flex justify-content-center align-items-center bg-theme bg-conversation'>
      <div className='d-flex flex-column align-items-center bg-accent' style={{padding: '3rem', borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
        <div className='brand'>
          <div className="logo brand-image my-3"/>
          <div className='brand-name'>Chat App</div> 
        </div>
        <h4 className="fw-bold mb-2 text-uppercase text-primary">Sign Up</h4>
        <p className="mb-3">Please enter your info!</p>

        <div className="mb-2 mx-5 w-100">
          <div className="row">
            <div className="col">
              <input ref={firstNameInputRef} className='form-control' placeholder='First name' type='text' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>
            </div>
            <div className="col">
              <input ref={lastNameInputRef} className='form-control' placeholder='Last name' type='text' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>
            </div>
          </div>
        </div>

        <input ref={userNameInputRef} className='form-control mb-2' placeholder='User name' type='text' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>
        <input ref={passwordInputRef} className='form-control mb-2' placeholder='Password' type='password' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>
        <input ref={passwordConfirmInputRef} className='form-control mb-2' placeholder='Confirm password' type='password' onFocus={(event) => {event.target.ariaFocus = true}} onBlur={(event) => {event.target.ariaFocus = false}}/>

        {/* <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p> */}
        <button ref={signupBtn} className='btn btn-primary my-4 w-100' onClick={onSignupBtnClicked}>
          Sign Up
        </button>

        <div>
          <div className="mb-0">Already have an account? <span onClick={() => {navigate('/login')}} className="fw-bold text-primary text-button">Login</span></div>
        </div>
      </div>
    </div>

  )
}

export default Signup