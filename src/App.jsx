import React from 'react'
import Display from './components/Display'
import Control from './components/Control'

const App = () => {
  return (
    <div className='h-screen w-screen bg-blue-500 flex flex-col justify-center items-center gap-5' >
      <Display/>
      <Control/>
    </div>
  )
}

export default App