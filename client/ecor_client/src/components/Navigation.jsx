import navigation from "../ultils/contains";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="w-main flex items-center h-[48px] py-2 border-y mb-6 text-sm">
      {navigation.map((el) => (
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "pr-12 hover:text-main text-main"
              : "pr-12 hover:text-main"
          }
          key={el.id}
          to={el.path}
        >
          {el.value}
        </NavLink>
      ))}
    </div>
  );
};

export default Navigation;
