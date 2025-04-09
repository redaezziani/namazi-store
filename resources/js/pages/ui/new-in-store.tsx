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
                    <div className="h-full w-full relative bg-gray-200">
                    <svg className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" fill="none"><defs><pattern id=":r2:" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path></pattern></defs><rect stroke="none" fill="url(#:r2:)" width="100%" height="100%"></rect></svg>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-gray-200 relative">
                <svg className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" fill="none"><defs><pattern id=":r2:" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path></pattern></defs><rect stroke="none" fill="url(#:r2:)" width="100%" height="100%"></rect></svg>

                </div>
                <div className="flex h-full w-full flex-col justify-between gap-[10px]">
                    <div className="h-full w-full bg-gray-200 relative">
                    <svg className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" fill="none"><defs><pattern id=":r2:" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path></pattern></defs><rect stroke="none" fill="url(#:r2:)" width="100%" height="100%"></rect></svg>

                    </div>
                    <div className="h-full"></div>
                </div>
            </article>
        </section>
    );
};

export default NewInStore;
