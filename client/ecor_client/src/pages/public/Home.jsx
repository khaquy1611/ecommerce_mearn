import {
  Sidebar,
  Banner,
  BestSeller,
  DealDailys,
  FeatureProduct,
} from "./../../components";

const Home = () => {
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
      <div className="w-full h-[500px]"></div>
    </>
  );
};

export default Home;
