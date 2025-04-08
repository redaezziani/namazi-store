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
import { useCartStore } from '@/stores/useCartStore'
import { formatCurrency } from '@/lib/utils'

const Cart = () => {
  const [open, setOpen] = useState(false)
  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity } = useCartStore()

  const handleRemoveItem = (id: string | number, size?: string, color?: string) => {
    removeItem(id, size, color)
  }

  const handleQuantityChange = (id: string | number, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity, size, color)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center relative group cursor-pointer">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {getTotalItems()}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full px-4 sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-xl tracking-tight font-light">YOUR BAG ({getTotalItems()})</SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="h-24 w-20 bg-gray-100 flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="text-gray-500 text-sm mt-1 space-y-1">
                        <div className="flex justify-between">
                          <span>Quantity: </span>
                          <div className="flex items-center">
                            <button
                              className="px-2 text-gray-400 hover:text-black"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                            >-</button>
                            <span className="mx-1">{item.quantity}</span>
                            <button
                              className="px-2 text-gray-400 hover:text-black"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                            >+</button>
                          </div>
                        </div>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      <button
                        className="text-sm text-gray-500 hover:text-black"
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between text-sm mb-6">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(getTotalPrice())}</span>
            </div>

            <SheetFooter className="flex-col gap-3 sm:flex-col">
              <Button className="w-full py-6 rounded-none bg-black hover:bg-gray-800 text-white">
                CHECKOUT
              </Button>
              <Button variant="outline" className="w-full py-6 rounded-none border-gray-300" onClick={() => setOpen(false)}>
                CONTINUE SHOPPING
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <p className="text-gray-500 mb-6">Your shopping bag is empty</p>
            <Button variant="outline" className="rounded-none border-gray-300" onClick={() => setOpen(false)}>
              CONTINUE SHOPPING
            </Button>
          </div>
        )}

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
