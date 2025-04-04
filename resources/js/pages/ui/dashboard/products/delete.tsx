import React from 'react'


 interface DeleteProps {
    id : string | number

 }
const DeleteProduct = ({ id }: DeleteProps) => {
  const handleDelete = () => {
    // Handle delete logic here
    console.log(`Deleting item with id: ${id}`);
  }
  return (
   <button className="text-red-500 hover:text-red-700  lowercase font-medium py-2 px-4 rounded">
       Delete
    </button>
  )
}

export default DeleteProduct
