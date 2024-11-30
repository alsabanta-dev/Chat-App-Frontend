import axios from 'axios'
import { Routes , Route, useNavigate } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
import Cookies from 'js-cookie'

import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LoadingPage from './pages/LoadingPage'
import ChatMDB from './pages/ChatMDB'

import '@popperjs/core/dist/cjs/popper.js';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'

export const ThemeContext = createContext(null)

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState()

  const [theme, setTheme] = useState(Cookies.get('theme')?Cookies.get('theme'):'light');

  const initiateTheme = (theme: string) => {
    const bodyStyle = document.getElementsByTagName('body')[0].style
    if(theme == 'dark') {
      bodyStyle.backgroundColor = 'rgb(22, 21, 21)'
      bodyStyle.color = '#ebecec'
    }else{
      bodyStyle.backgroundColor = '#fff'
      bodyStyle.color = 'rgb(22, 21, 21)'
    }
  }

  const toggleTheme = () => {
    initiateTheme(theme == 'light'? 'dark':'light')
    Cookies.set("theme", theme == 'light'? 'dark':'light');
    setTheme(theme == 'light'? 'dark':'light')
  }
  
  const isLoggedIn = async (path: string = '/') => {
    try{
      const isLoggedInRes = await axios(`${import.meta.env.VITE_SERVER_URL}/users/isLoggedIn`,{
        withCredentials: true
      })
      // console.log('✔️', isLoggedInRes)
      setUser(isLoggedInRes.data.user)
      navigate(path)
    }catch(err){
      navigate('login')
      console.log('❌', err)
    }
  }

  useEffect(() => {
    if(!user && !(location.pathname.includes('login') || location.pathname.includes('signup'))) 
      isLoggedIn(location.pathname)
  },[])

  if(!user){
    if(!(location.pathname.includes('login') || location.pathname.includes('signup')))
      return <LoadingPage/>
  }else{
    if(location.pathname.includes('login') || location.pathname.includes('signup')){
      navigate('/')
    }
  }

  initiateTheme(theme?theme:'light')

  // Bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList]
  tooltipList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div id={theme}>
        <Routes>
          <Route path='/' element={<Chat user={user} setUser={setUser}/>}/>
          <Route path='/chat' element={<ChatMDB/>}/>
          <Route path='/login' element={<Login setUser={setUser}/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/loading' element={<LoadingPage/>}/>
        </Routes>
      </div>
    </ThemeContext.Provider>
  )

  
}

export default App
