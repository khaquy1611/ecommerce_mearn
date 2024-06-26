import { Outlet } from "react-router-dom";
import { Header, Navigation, TopHeader, Footer } from "../../components";
const Public = () => {
  return (
    <div className="w-full flex-col items-center">
      <TopHeader />
      <Header />
      <Navigation />
      <div className="w-full flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Public;
