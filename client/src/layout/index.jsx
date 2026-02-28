import React from 'react'
import logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
   <>
    <div>
        <div className='flex justify-start align-middle p-3 border-b-[1px] border-slate-900 shadow-md shadow-slate-600'  >
          <img src={logo} alt="logo" width="40" height="20" />
          <h1 className=' text-[#0a68a2]  text-2xl font-cursive text-center'>Chat<span className='text-[#2c93c2]'>Me</span></h1>
        </div>
    </div>
    {children}
   </>
   
   
  )
}

export default AuthLayouts
