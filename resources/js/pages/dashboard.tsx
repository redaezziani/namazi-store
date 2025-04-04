import AppLayout from '@/layouts/app-layout'
import React from 'react'

const Dashboard = () => {
  return (
    <AppLayout>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-4 text-lg">Welcome to the dashboard!</p>
        </div>
    </AppLayout>
  )
}

export default Dashboard
