import useBreadcrumbs from "use-react-router-breadcrumbs";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
const Breadcrumbs = ({ title, category }) => {
  const routes = [
    { path: "/:category", breadcrumb: category },
    { path: "/", breadcrumb: "Home" },
    { path: "/:category/:pid/:title", breadcrumb: title },
  ];
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <div className="text-sm flex items-center">
      {breadcrumbs
        ?.filter((el) => !el?.match?.route === false)
        ?.map(({ match, breadcrumb }, index, self) => (
          <Link
            className="flex items-center hover:text-main gap-1"
            to={match.pathname}
            key={match.pathname}
          >
            <span className="capitalize">{breadcrumb}</span>
            {index !== self.length - 1 && <IoIosArrowForward />}
          </Link>
        ))}
    </div>
  );
};

Breadcrumbs.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
};
export default Breadcrumbs;
