/* eslint-disable react-refresh/only-export-components */
import { memo, Fragment, useState } from "react";
import avatar from "../../assets/avartar.png";
import { memberSidebar } from "../../ultils/contains";
import { NavLink, Link } from "react-router-dom";
import { clsx } from "clsx";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { useSelector } from "react-redux";
const activeStyle =
  "px-4 py-2 flex items-center gap-2  bg-blue-500 text-white font-semibold";
const notActivedStyle = "px-4 py-2 flex items-center gap-2  hover:bg-blue-100";

const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const { current } = useSelector((state) => state.user);
  const handleShowTabs = (tabsId) => {
    if (actived.some((el) => el === tabsId))
      setActived((prev) => prev.filter((el) => el !== tabsId));
    else setActived((prev) => [...prev, tabsId]);
  };
  return (
    <div className="py-4 bg-white h-full cursor-pointer w-[250px] flex-none">
      <Link
        to={`/`}
        className="w-full flex flex-col items-center justify-center py-4"
      >
        <img
          src={current?.avatar || avatar}
          alt="logo"
          className="w-16 h-16 object-cover"
        />
        <span>{`${current?.lastName} ${current?.firstName}`}</span>
      </Link>
      <div>
        {memberSidebar &&
          memberSidebar.map((el) => (
            <Fragment key={el.id}>
              {el.type === "SINGLE" && (
                <NavLink
                  to={el.path}
                  className={({ isActive }) =>
                    clsx(isActive && activeStyle, !isActive && notActivedStyle)
                  }
                >
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                </NavLink>
              )}
              {el.type === "PARENT" && (
                <div
                  onClick={() => handleShowTabs(+el.id)}
                  className="flex flex-col"
                >
                  <div className="flex items-center hover:bg-blue-100 px-4 py-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span>{el.icon}</span>
                      <span>{el.text}</span>
                    </div>
                    {actived.some((id) => id === el.id) ? (
                      <AiOutlineCaretRight />
                    ) : (
                      <AiOutlineCaretDown />
                    )}
                  </div>
                  {actived.some((id) => +id === +el.id) && (
                    <div className="flex flex-col">
                      {el?.subMenu?.map((el) => (
                        <NavLink
                          to={el.path}
                          key={el.text}
                          onClick={(e) => e.stopPropagation()}
                          className={({ isActive }) =>
                            clsx(
                              isActive && activeStyle,
                              !isActive && notActivedStyle,
                              "pl-10"
                            )
                          }
                        >
                          {el.text}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default memo(MemberSidebar);
