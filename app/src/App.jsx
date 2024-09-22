import { useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

import Login from './Login';
import Register from './Register'
import CreatePoll from './Create';
import Dashboard from './Dashboard'
import Details from './Detail';
import { AuthProvider } from './AuthContext';
import Result from './Result'
function App() {
 
  const router=createBrowserRouter([
   
    
    {
      path:'/',
      element:    <><Register/></>
    },
    {
      path:'/result',
      element:    <><Result/></>
    },
    {
      path:'/login',
      element:    <><Login/></>
    },
    {
      path:'/dash',
      element:    <><Dashboard/></>
    },
    {
      path:'/create',
      element:    <><CreatePoll/></>
    },
    {
      path:'/poll/:id',
      element:    <><Details/></>
    },
   
  ])
  return (
    <>
      <AuthProvider>
   <RouterProvider router={router} />
   </AuthProvider>
    </>
  )
}

export default App
