import React from 'react'
import { Suspense } from 'react'
import DashboardPage from './page'
import {BarLoader} from 'react-spinners'


function DashboardLayout() {
  return (
    <div className='px-5'>
        <h1 className='text-4xl font-bold gradient-title mb-4'>Dashboard</h1>

        {/*dashboard page*/}
        <Suspense fallback={<BarLoader className='mt-4' width="100%" color='#9333ea'/>}>
            <DashboardPage />
        </Suspense>
    </div>
  )
}

export default DashboardLayout
