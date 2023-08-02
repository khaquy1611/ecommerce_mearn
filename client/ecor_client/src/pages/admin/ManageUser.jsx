/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import { useState, useEffect, useCallback } from "react";
import {
  getAllUsers,
  getAllRoles,
  updateUserByAdmin,
  deleteUserApi,
} from "../../api";
import moment from "moment";
import {
  InputField,
  Pagination,
  InputForm,
  Select,
  Button,
} from "../../components";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { blockedUser } from '../../ultils/contains';
import clsx from "clsx";
const ManageUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    mobile: "",
    isBlocked: "",
  });
  const [data, setData] = useState({
    users: [],
    roles: [],
    total: 0,
  });
  const [queries, setQueries] = useState({
    q: "",
  });
  const [editEl, setEditEl] = useState();
  const [update, setUpdate] = useState(false);
  const [params] = useSearchParams();
  const fetchData = async (params) => {
    const responseUsers = await getAllUsers({
      ...params,
      limit: +import.meta.env.VITE_REACT_APP_LIMIT,
    });

    const responseRoles = await getAllRoles({});

    if (responseUsers?.success)
      setData((prev) => ({
        ...prev,
        users: responseUsers?.users,
        total: responseUsers?.total,
      }));
    if (responseRoles?.success)
      setData((prev) => ({
        ...prev,
        roles: responseRoles?.RoleData,
        total: responseUsers?.total,
      }));
  };
  const queriesDebounce = useDebounce(queries?.q, 800);
  const render = useCallback(() => {
    setUpdate(!update);
  });
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchData(queries);
  }, [params, queriesDebounce, update]);

  const handleUpdate = async (data, e) => {
    e.preventDefault();
    const response = await updateUserByAdmin(editEl._id, data);
    if (response.success) {
      setEditEl(null);
      render();
      toast.success(response.msg, {
        theme: "colored",
      });
    } else {
      toast.error(response.mes, {
        theme: "dark",
      });
    }
  };

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: `Are you sure...`,
      text: `Are you ready remove this user?`,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteUserApi(uid);
        if (response.success) {
          render();
          toast.success(response.msg, {
            theme: "colored",
          });
        } else {
          toast.error(response.msg);
        }
      }
    });
  };

  useEffect(() => {
    if (editEl) {
      reset({
        role: editEl.role,
        isBlockedtus: editEl.isBlocked
      });
    }
  }, [editEl]);
  return (
    <div className={clsx("w-full", editEl && 'pl-16')}>
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lí người dùng</span>
      </h1>
      <div className="w-full p-4">
        <div className="flex justify-end py-4">
          <InputField
            nameKey="q"
            value={queries?.q}
            setValue={setQueries}
            isHideLabel
            style="w-[500px]"
            placeholder="Tìm kiếm tên hoặc email người dùng..."
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)} action="">
          {editEl && <Button type="submit">Update</Button>}
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-700 text-[13px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Email address:</th>
                <th className="px-4 py-2">Tên đầu:</th>
                <th className="px-4 py-2">Tên cuối:</th>
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
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <InputForm
                          validate={{
                            required: `Reuired fill.`,
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Invalid email address",
                            },
                          }}
                          defaultValue={editEl?.email}
                          fullWidth
                          errors={errors}
                          register={register}
                          id={`email`}
                        />
                      ) : (
                        <span>{el.email}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <InputForm
                          defaultValue={editEl?.firstName}
                          fullWidth
                          errors={errors}
                          register={register}
                          id={`firstName`}
                          validate={{
                            required: `Reuired fill.`,
                            maxLength: {
                              value: 15,
                              message: "must be max 15 chars",
                            },
                          }}
                        />
                      ) : (
                        <span>{el?.firstName}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <InputForm
                          defaultValue={editEl?.lastName}
                          fullWidth
                          errors={errors}
                          register={register}
                          id={`lastName`}
                          validate={{
                            required: `Reuired fill.`,
                            maxLength: {
                              value: 15,
                              message: "must be max 15 chars",
                            },
                          }}
                        />
                      ) : (
                        <span>{el?.lastName}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <Select
                          register={register}
                          errors={errors}
                          fullWidth
                          defaultValue={el?.role}
                          id="role"
                          validate={{ required: `Required fill` }}
                          options={data?.roles}
                        />
                      ) : (
                        <span>
                          {
                            data?.roles?.find((role) => role.code == el.role)
                              ?.value
                          }
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <InputForm
                          defaultValue={editEl?.mobile}
                          fullWidth
                          errors={errors}
                          register={register}
                          id={`mobile`}
                          validate={{
                            required: `Reuired fill.`,
                            pattern: {
                              value: /^[62|0]+\d{9}/gi,
                              message: "Invalid phone number",
                            },
                          }}
                        />
                      ) : (
                        <span>{el?.mobile}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <Select
                          register={register}
                          errors={errors}
                          fullWidth
                          defaultValue={el?.isBlocked}
                          id="isBlocked"
                          validate={{ required:  `Required fill` }}
                          options={blockedUser}
                        />
                      ) : (
                        <span>{el?.isBlocked ? "Blocked" : "Active"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {moment(el?.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-2 px-4">
                      {editEl?._id === el._id ? (
                        <span
                          onClick={() => setEditEl(null)}
                          className="px-2 text-orange-600 hover:underline cursor-pointer"
                        >
                          Back
                        </span>
                      ) : (
                        <span
                          onClick={() => setEditEl(el)}
                          className="px-2 text-orange-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </span>
                      )}
                      <span
                        onClick={() => handleDeleteUser(el?._id)}
                        className="px-2 text-orange-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </form>
        <div className="w-full text-right">
          <Pagination totalCount={data?.total} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
