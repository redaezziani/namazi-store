import AppLayout from '@/layouts/app-layout'
import React from 'react'
import ProductsTable from '../ui/dashboard/products/table'

const Index = () => {
  return (
    <AppLayout>
        <div className="flex flex-col justify-start items-start p-8">
            <h1 className="text-xl font-bold">
                Products
            </h1>
            <p className=" ">
                Welcome to the products page!
            </p>
            <ProductsTable />
        </div>
    </AppLayout>
  )
}

export default Index
