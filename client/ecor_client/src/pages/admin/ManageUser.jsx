import { useState, useEffect } from "react";
import { getAllUsers, getAllRoles } from "../../api";
import moment from "moment";
const ManageUser = () => {
  const [data, setData] = useState({
    users: [],
    roles: [],
  });
  const fetchData = async (params) => {
    const responseUsers = await getAllUsers(params);
    const responseRoles = await getAllRoles(params);
    if (responseUsers?.success)
      setData((prev) => ({ ...prev, users: responseUsers?.users }));
    if (responseRoles?.success)
      setData((prev) => ({ ...prev, roles: responseRoles?.RoleData }));
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lí người dùng</span>
      </h1>
      <div className="w-full p-4">
        <table className="table-auto mb-6 text-left w-full">
          <thead className="font-bold bg-gray-700 text-[13px] text-white">
            <tr className="border border-gray-500">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Email address:</th>
              <th className="px-4 py-2">Tên đầy đủ:</th>
              <th className="px-4 py-2">Role:</th>
              <th className="px-4 py-2">Số điện thoại:</th>
              <th className="px-4 py-2">Trạng thái:</th>
              <th className="px-4 py-2">Ngày tạo:</th>
              <th className="px-4 py-2">Hành động:</th>
            </tr>
          </thead>
          <tbody>
            {data?.users &&
              data?.users?.map((el, _idx) => (
                <tr key={el._id} className="border border-gray-500">
                  <td className="py-2 px-4">{_idx + 1}</td>
                  <td className="py-2 px-4">{el?.email}</td>
                  <td className="py-2 px-4">
                    {el?.lastName} {el?.firstName}
                  </td>
                  <td className="py-2 px-4">
                    {data?.roles?.find((role) => role.code == el.role)?.value}
                  </td>
                  <td className="py-2 px-4">{el?.mobile}</td>
                  <td className="py-2 px-4">{el?.isBlocked ? "Blocked" : "Active"}</td>
                  <td className="py-2 px-4">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>
                  <td className="py-2 px-4">
                    <span className="PX-2 text-orange-600 hover:underline cursor-pointer">Edit</span>
                    <span className="PX-2 text-orange-600 hover:underline cursor-pointer">Delete</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
