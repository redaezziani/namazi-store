import { useState } from 'react'
import { Link } from '@inertiajs/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Mockup cart items
const cartItems = [
  { id: 1, name: 'Minimal T-shirt', price: '$39.00', quantity: 1, image: '/mockups/product-1.jpg' },
  { id: 2, name: 'Linen Blend Pants', price: '$89.00', quantity: 1, image: '/mockups/product-2.jpg' },
  { id: 3, name: 'Cotton Cardigan', price: '$59.00', quantity: 1, image: '/mockups/product-3.jpg' }
]

const Cart = () => {
  const [open, setOpen] = useState(false)
  const itemCount = cartItems.length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center relative group cursor-pointer">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full px-4 sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-xl tracking-tight font-light">YOUR BAG ({itemCount})</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-24 w-20 bg-gray-100 flex-shrink-0"></div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">Quantity: {item.quantity}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.price}</span>
                  <button className="text-sm text-gray-500 hover:text-black">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between text-sm mb-6">
          <span>Subtotal</span>
          <span className="font-medium">$187.00</span>
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-col">
          <Button className="w-full py-6 rounded-none bg-black hover:bg-gray-800 text-white">
            CHECKOUT
          </Button>
          <Button variant="outline" className="w-full py-6 rounded-none border-gray-300" onClick={() => setOpen(false)}>
            CONTINUE SHOPPING
          </Button>
        </SheetFooter>

        <div className="mt-8 text-center">
          <Link href="/cart" className="text-xs uppercase tracking-wide hover:underline">
            View Full Cart
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Cart
