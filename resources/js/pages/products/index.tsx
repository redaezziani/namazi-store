import AppLayout from '@/layouts/app-layout'
import ProductsTable from '../ui/dashboard/products/table'

const Index = () => {
  return (
    <AppLayout>
        <div className="flex flex-col justify-start items-start px-8">
            <ProductsTable />
        </div>
    </AppLayout>
  )
}

export default Index
