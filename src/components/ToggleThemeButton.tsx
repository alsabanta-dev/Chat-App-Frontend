import { ThemeContext } from '../App'
import { useContext } from 'react'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  
  const handleClick = () => {
    toggleTheme()
    const myTooltipEl = document.getElementById('whatever')
    const tooltip = bootstrap.Tooltip.getOrCreateInstance(myTooltipEl)
    tooltip.hide()
  }

  return (
    <i id='whatever' className={`btn-icon my-2 fa fa-${theme == 'dark'? 'sun':'moon'}`} onClick={handleClick} data-bs-title={`Switch to ${theme=='dark'?'light':'dark'} theme`} data-bs-toggle="tooltip"/>
  )
}