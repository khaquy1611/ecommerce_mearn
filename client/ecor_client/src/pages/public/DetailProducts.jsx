import { useParams } from "react-router-dom";
const DetailProducts = () => {
  const { pid } = useParams();
  console.log('pid', pid);
  return <div>Detail Products Title</div>;
};

export default DetailProducts;
