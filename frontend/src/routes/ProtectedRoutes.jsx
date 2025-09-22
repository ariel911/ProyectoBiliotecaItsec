import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {

    let isLogged =localStorage.getItem("token")
    //console.log(isLogged.data.data.data)

    if(!isLogged){
       return <Navigate to="/login" />
    }
  return (
    <Outlet />//dar acceso a todas las rutas que estan envueltas por protectedRoutes
  )
}

export default ProtectedRoutes
