import { useEffect } from "react";
import { InputForm, Button } from "../../components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import  avartar from "../../assets/avartar.png"; 
import { apiUpdateCurrent } from './../../api/user';
import { getCurrentUsers } from './../../store/users/UserActions';
import { toast } from "react-toastify";
const Personal = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    if (data.avatar.length > 0) formData.append('avatar', data.avatar[0])
    delete data.avatar
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    const response = await apiUpdateCurrent(formData);
    if (response.success) {
      dispatch(getCurrentUsers());
      toast.success(response.msg, { style: { color: "#000" } });
    }else {
      toast.error(response.msg, { style: { color: "#000" } })
    }
  };
  useEffect(() => {
    reset({
      firstName: current?.firstName,
      lastName: current?.lastName,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
    });
  }, [current, reset]);
  return (
    <div className="w-full relative px-4">
      <header className="text-3x; font-semibold py-4 border-b border-b-blue-200">
        Personal
      </header>
      <form
        onSubmit={handleSubmit(handleUpdateInfor)}
        className="w-3/5 mx-auto py-8 flex flex-col gap-4"
      >
        <InputForm
          label="FirstName"
          register={register}
          errors={errors}
          id="firstName"
          validate={{
            required: `Need fill this field`,
          }}
        />
        <InputForm
          label="LastName"
          register={register}
          errors={errors}
          id="lastName"
          validate={{
            required: `Need fill this field`,
          }}
        />
        <InputForm
          label="Email address"
          register={register}
          errors={errors}
          id="email"
          validate={{
            required: `Need fill this field`,
            pattern: {
              value: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/,
              message: `Email invalid`
            }
          }}
        />
        <InputForm
          label="Phone"
          register={register}
          errors={errors}
          id="mobile"
          validate={{
            required: `Need fill this field`,
            pattern: {
              value: /^(1\s?)?\d{3}([-\s]?)\d{3}\2\d{4}$/gm,
              message: `Phone invalid`
            }
          }}
        />
        <div className="flex items-center gap-2">
          <span className="font-medium">Account status:</span>
          <span>{current?.isBlocked ? "Blocked" : "Active"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Role:</span>
          <span>{current?.role === 0 ? "Admin" : "User"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">CreatedAt:</span>
          <span>{moment(current?.createdAt).fromNow()}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-medium">Profile image:</span>
          <label htmlFor="file">
          <img src={current?.avatar || avartar} alt="" className="w-10 h-10 object-cover rounded-sm"/>
          </label>
          <input type="file" name="file" id="avatar" {...register('avatar')} />
        </div>
        <div className="w-full flex justify-end">
          <Button type="submit">Update User Infomation</Button>
        </div>
      </form>
    </div>
  );
};

export default Personal;
