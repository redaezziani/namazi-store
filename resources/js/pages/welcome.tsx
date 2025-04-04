import StoreLayout from '@/layouts/store-layout';
import StoreHeader from './ui/store-header';
import BestForYou from './ui/best-for-you';
import NewInStore from './ui/new-in-store';
import CardsGroup from './ui/card-group/card-group';

const welcome = () => {
    return (
        <StoreLayout>
            <StoreHeader />
            <BestForYou />
            <NewInStore />
            <CardsGroup
                title="Best For You"
                description="Discover our curated selection of products tailored just for you."
                urlQuery="best-for-you"
                url="/products/best-for-you"
                data={[]}
            />
        </StoreLayout>
    );
};

export default welcome;
