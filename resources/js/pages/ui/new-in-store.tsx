const NewInStore = () => {
    return (
        <section className="relative container mx-auto flex flex-col items-start justify-start gap-3 px-4 py-2">
            <h3 className="group relative inline-block text-2xl tracking-tight text-gray-800">
                New in Store
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </h3>
            <article className="grid h-auto w-full grid-cols-1 gap-[20px] md:h-[600px] md:grid-cols-4">
                <div className="flex h-full w-full flex-col justify-between gap-[10px]">
                    <div className="h-full"></div>
                    <div className="h-full w-full bg-gray-200"></div>
                </div>
                <div className="col-span-2 h-full w-full bg-gray-200"></div>
                <div className="flex h-full w-full flex-col justify-between gap-[10px]">
                    <div className="h-full w-full bg-gray-200"></div>
                    <div className="h-full"></div>
                </div>
            </article>
        </section>
    );
};

export default NewInStore;
