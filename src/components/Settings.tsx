import axios from "axios"
import { createRef, RefObject, useState } from "react"

interface Props {
  user: object | undefined,
  setUser: any
}
export default function Settings({user, setUser}: Props) {

  const userPhotoInputRef:RefObject<HTMLInputElement> = createRef()
  const userPhotoRef:RefObject<HTMLImageElement> = createRef()
  const firstNameInputRef:RefObject<HTMLInputElement> = createRef()
  const lastNameInputRef:RefObject<HTMLInputElement> = createRef()
  const userNameInputRef:RefObject<HTMLInputElement> = createRef()
  const newPasswordInputRef:RefObject<HTMLInputElement> = createRef()
  const confirmNewPasswordInputRef:RefObject<HTMLInputElement> = createRef()
  const currentPasswordInputRef:RefObject<HTMLInputElement> = createRef()

  const changePhoto = () => {
    userPhotoInputRef.current!.click()
  }

  const setNewUserPhoto = () => {
    if (userPhotoInputRef.current!.files && userPhotoInputRef.current!.files[0]){
      const reader = new FileReader()
      reader.readAsDataURL(userPhotoInputRef.current!.files[0])
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if(e.target && e.target.result){
          userPhotoRef.current!.src = e.target.result.toString()
        }
      }
    }
  }

  const deletePhoto = () => {
    userPhotoInputRef.current!.files = null
    userPhotoRef.current!.src = `http://127.0.0.1:3000/img/users/${user.photo}`
  }

  const saveChanges = async () => {
    const formData = new FormData()
    if(firstNameInputRef.current!.value && firstNameInputRef.current!.value != user.firstName)
      formData.append('firstName', firstNameInputRef.current!.value)
    if(lastNameInputRef.current!.value && lastNameInputRef.current!.value != user.lastName)
      formData.append('lastName', lastNameInputRef.current!.value)
    if(userNameInputRef.current!.value && userNameInputRef.current!.value != user.userName)
      formData.append('userName', userNameInputRef.current!.value)
    if(userPhotoInputRef.current!.files && userPhotoInputRef.current!.files.length > 0)
      formData.append('photo', userPhotoInputRef.current!.files[0])

    try{
      const res = await axios(`${import.meta.env.VITE_SERVER_URL}/users/updateMe`,{
        method: 'PATCH',
        data: formData,
        withCredentials: true
      })
      // console.log('✔️', res)
      setUser(res.data.data.user)
      alert('Changes saved successfully')
    }catch(err){
      if(err.response && err.response.data) alert(err.response.data.message)
      console.log('❌', err)
    }
  }

  const changePassword = async () => {
    if(!currentPasswordInputRef.current!.value) return alert('Current password is required')
    if(!newPasswordInputRef.current!.value) return alert('New password is required')
    if(!confirmNewPasswordInputRef.current!.value) return alert('confirm new password is required')
    
    const data = {}
    data.currentPassword = currentPasswordInputRef.current!.value
    data.newPassword = newPasswordInputRef.current!.value
    data.confirmNewPassword = confirmNewPasswordInputRef.current!.value

    if(data.newPassword != data.confirmNewPassword) return alert('Passwords are not the same')
    
    try{
      const res = await axios(`${import.meta.env.VITE_SERVER_URL}/users/updateMyPassword`,{
        method: 'PATCH',
        data,
        withCredentials: true
      })
      // console.log('✔️', res)
      setUser(res.data.data.user)
      alert('Password changed successfully')
    }catch(err){
      if(err.response && err.response.data) alert(err.response.data.message)
      console.log('❌', err)
    }
  }

  return (<>
    <div id="settings" className="d-flex flex-column scrollable px-1 pb-5" style={{height: '100%'}}>
      <div className="main-container-title">Settings</div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img className="avatar my-2 shadow" ref={userPhotoRef} src={`http://127.0.0.1:3000/img/users/${user.photo}`} alt="avatar" style={{width: '100px', height: '100px', borderWidth: '4px', borderColor: 'var(--color-primary)', borderStyle: 'solid', objectFit: 'cover'}}/>
        <strong>{user.name}</strong>
        <label>@{user.userName}</label>
      </div>
      <div className="small text-primary"><i className="fa fa-pen me-2 mb-3"></i><strong>Edit your info</strong></div>
      <div className="mb-3">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <button className="btn btn-sm btn-secondary" onClick={changePhoto}><i className="fa fa-image me-2"></i>Change photo</button>
          {/* {userPhotoInputRef.current && userPhotoInputRef.current!.value? */}
            <button className="btn btn-sm btn-link text-danger ms-1" title="Delete photo" onClick={deletePhoto}><i className="fa fa-trash"></i></button>
            {/* :
            null
          } */}
          <input type="file" accept="image/*" ref={userPhotoInputRef} onChange={setNewUserPhoto} hidden/>
        </div>
        <div className="mb-1">
          <label className="smaller" htmlFor="first-name">First Name</label>
          <input type="text" ref={firstNameInputRef} id="first-name" className="form-control" placeholder="First name" defaultValue={user.firstName}/>
        </div>
        <div className="mb-1">
          <label className="smaller" htmlFor="last-name">First Name</label>
          <input type="text" ref={lastNameInputRef} id="last-name" className="form-control" placeholder="Last name" defaultValue={user.lastName}/>
        </div>
        <div className="mb-1">
          <label className="smaller" htmlFor="username">User Name</label>
          <div className="input-group">
            <span className="input-group-text">@</span>
            <input type="text" ref={userNameInputRef} id="username" className="form-control" placeholder="User name" defaultValue={user.userName}/>
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={saveChanges} style={{width: '100%'}}>Save Changes</button>
      </div>
      <div className="small text-primary mt-2"><i className="fa fa-lock me-2 mb-3"></i><strong>Change your password</strong></div>
      <div className="mb-3">
        <div className="mb-1">
          <label className="smaller" htmlFor="current-password">Current Password</label>
          <input type="password" ref={currentPasswordInputRef} id="current-password" className="form-control" placeholder="Current password"/>
        </div>
        <div className="mb-1">
          <label className="smaller" htmlFor="new-password">New Password</label>
          <input type="password" ref={newPasswordInputRef} id="new-password" className="form-control" placeholder="New password"/>
        </div>
        <div className="mb-1">
          <label className="smaller" htmlFor="confirm-password">Confirm Password</label>
          <input type="password" ref={confirmNewPasswordInputRef} id="confirm-password" className="form-control" placeholder="Confirm new password"/>
        </div>
        <button className="btn btn-primary mt-3" onClick={changePassword} style={{width: '100%'}}>Change Password</button>
      </div>
    </div>
  </>)
}
