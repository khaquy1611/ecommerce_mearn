import {
  Sidebar,
  Banner,
  BestSeller,
  DealDailys,
  FeatureProduct,
  CustomSlider,
} from "./../../components";
import { useSelector } from "react-redux";
import icons from "../../ultils/icon";

const Home = () => {
  const { IoIosArrowForward } = icons;
  const { newProducts } = useSelector((state) => state.productReducer);
  const { categories } = useSelector((state) => state.categoriesReducer);
  console.log("categories", categories);
  return (
    <>
      <div className="flex w-main">
        {/* Sidebar Left */}
        <div className="flex flex-col gap-5 w-[25%] flex-auto">
          <Sidebar />
          <DealDailys />
        </div>
        {/* Banner Right */}
        <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="my-8">
        <FeatureProduct />
      </div>
      <div className="my-8 w-full">
        <h3 className="text-[20px] text-left font-semibold py-[15px] border-b-2 border-main">
          NEW ARRIVALS
        </h3>
        <div className="mt-4 mx-[-10px]">
          <CustomSlider products={newProducts} />
        </div>
      </div>
      <div className="my-8 w-full">
        <h3 className="text-[20px] text-left font-semibold py-[15px] border-b-2 border-main">
          HOT COLLECTIONS
        </h3>
        <div className="flex flex-wrap gap-4 mt-4">
          {categories &&
            categories
              ?.filter((el) => el.brand.length > 0)
              ?.map((el) => (
                <div className="w-[396px]" key={el._id}>
                  <div className="border flex p-4 gap-4 min-h-[190px]">
                    <img
                      src={el?.image}
                      alt=""
                      className="w-[144px] h-[129px] object-cover"
                    />
                    <div className="flex-1 text-gray-700">
                      <h4 className="font-semibold uppercase">{el.title}</h4>
                      <ul className="text-sm">
                        {el?.brand?.map((item) => (
                          <span
                            key={item}
                            className="flex gap-1 items-center text-gray-500"
                          >
                            <IoIosArrowForward size="14" />
                            <li>{item}</li>
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <div className="my-8 w-full">
        <h3 className="text-[20px] text-left font-semibold py-[15px] border-b-2 border-main">
         BLOG POSTS
        </h3>
        </div>
      </div>
    </>
  );
};

export default Home;
