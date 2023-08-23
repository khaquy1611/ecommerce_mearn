/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import withBaseComponent from "../../hocs/withBase";

const MyCart = (props) => {
  return <div onClick={() => props.navigate('/')}>MyCart</div>;
};

export default withBaseComponent(MyCart);
