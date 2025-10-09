import { ReactUserLogin } from '@neuctra/authix'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <ReactUserLogin logoUrl={"/logo-dark.png"} />
    </div>
  )
}

export default LoginPage