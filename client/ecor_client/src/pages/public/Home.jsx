import { Sidebar, Banner, BestSeller } from "./../../components";

const Home = () => {
  return (
    <>
      <div className="flex w-main">
        {/* Sidebar Left */}
        <div className="flex flex-col gap-5 w-[20%] flex-auto">
          <Sidebar />
          <span>Deal daily</span>
        </div>
        {/* Banner Right */}
        <div className="flex flex-col gap-5 pl-5 w-[85%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="w-full h-[500px]"></div>
    </>
  );
};

export default Home;
