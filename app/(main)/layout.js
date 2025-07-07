import React from 'react'

function Mainlayout({ children }) {
  return (
    <div className='container mx-auto my-32'>
      {children}
    </div>
  )
}

export default Mainlayout
