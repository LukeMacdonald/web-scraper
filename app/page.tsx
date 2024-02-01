import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/actions";
import { MotionImage, MotionDiv } from "@/components/motion";
import Searchbar from "@/components/Searchbar";
const Home = async () => {
  const allProducts = await getAllProducts();
  return (
    <>
      <section className="relative z-0 flex w-full min-h-screen bg-gray-800 flex-col items-start justify-start p-24">
        <MotionImage
          src="/assets/images/landing.svg"
          className="absolute z-10 left-0 -top-0 w-full sm:hidden"
          alt="landing"
          width={0}
          height={0}
          initial={{ rotate: 0, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <MotionDiv
          initial={{ x: -300, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-4 z-20 pt-36 pl-10 xl:pt-20 lg:pt-14 md:pt-0 sm:mb-20 sm:pt-0"
        >
          <h1 className="landing-title">AmazonTracker</h1>
          <p className="w-[70%] text-md md:text-sm">
            Powerful, self-serve product and growth analytics to help you
            convert, engage, and retain more.
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="z-20 pl-56 pt-72 pb-44 xl:pl-20 lg:pl-10 md:pl-0 flex items-center justify-center w-full space-x-5"
        >
          <Searchbar />
          {/* <input className="search-input" /> */}
          {/* <button className="search-btn">Search</button> */}
        </MotionDiv>
        <div className="w-full bg-white p-5 rounded-md mx-auto">
          <h1 className="text-3xl text-black font-semibold pt-5">Trending</h1>
          <hr className="mt-2" />
          <div className="w-full rounded-sm px-5 mx-auto flex flex-wrap gap-x-5 gap-y-10">
            {allProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
