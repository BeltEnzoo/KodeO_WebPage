import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginPage from './LoginPage.jsx'
import AdminDashboard from './app/pages/AdminDashboard.jsx'
import ClientDashboard from './app/pages/ClientDashboard.jsx'

const currentPath = window.location.pathname

let RootComponent = App

if (currentPath === '/login') {
  RootComponent = LoginPage
} else if (currentPath === '/dashboard/admin') {
  RootComponent = AdminDashboard
} else if (currentPath === '/dashboard/client') {
  RootComponent = ClientDashboard
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
