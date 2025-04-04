import CardsPagination from "./card-pagination";


interface CardGroupProps {
    title? : string;
    description? : string;
    urlQuery ?: string;
    url : string;
    data :any[]
}
const CardsGroup = ({ title, description, urlQuery, url, data }: CardGroupProps) => {
  return (
    <section
    araia-label={title}
    id={urlQuery}
    className="relative container mx-auto flex flex-col items-start mt-6 justify-start gap-3 px-4 py-2"
    >
        <h3
            className="group relative inline-block text-2xl tracking-tight text-gray-800"
            >
            {title}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
        <article className="grid h-auto w-full grid-cols-1 gap-[20px]  md:grid-cols-4">
            {data.map((item, index) => (
               <div className="w-full col-span-1 bg-muted flex h-[30rem]   flex-col justify-between gap-[10px]" key={index}>

               </div>
            ))}
        </article>
        <CardsPagination
        currentPage={1}
        totalPages={5}
            />
    </section>
  )
}

export default CardsGroup
