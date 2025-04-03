import StoreLayout from '@/layouts/store-layout';
import StoreHeader from './ui/store-header';
import BestForYou from './ui/best-for-you';

const welcome = () => {
    return (
        <StoreLayout>
            <StoreHeader />
            <BestForYou />
        </StoreLayout>
    );
};

export default welcome;
