import { useState, useCallback } from "react";
import bg_login from "../../assets/bg_login.jpg";
import { InputField, Button } from "../../components";
import { userRegister, userLogin } from "../../api/user";
import Swal from "sweetalert2";
import { register } from "../../store/users/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const { email, password } = payload;
  const [isRegister, setRegister] = useState(false);
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
    });
  };
  const handleSubmit = useCallback(async () => {
    if (isRegister) {
      const response = await userRegister(payload);
      if (response?.success) {
        Swal.fire(`Congratulation`, response?.msg, "success").then(() => {
          setRegister(false);
          resetPayload();
        });
      } else {
        Swal.fire(`Oops!!`, response?.msg, "error");
      }
    } else {
      const response = await userLogin({ email, password });
      if (response?.success) {
        dispatch(
          register({
            isLoggedIn: true,
            token: response?.accessToken,
            userData: response?.userData,
          })
        );
        navigate(`/${path.HOME}`);
      } else {
        Swal.fire(`Oops!!`, response?.msg, "error");
      }
    }
  }, [dispatch, email, isRegister, navigate, password, payload]);
  return (
    <div className="w-screen h-screen relative">
      <img
        src={bg_login}
        alt="background_login"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]">
          <h1 className="text-[28px] font-semibold text-main mb-8 text-center">
            {isRegister ? "Đăng Ký" : "Đăng Nhập"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2 w-full">
              <InputField
                value={payload.firstName}
                setValue={setPayload}
                nameKey="firstName"
              />
              <InputField
                value={payload.lastName}
                setValue={setPayload}
                nameKey="lastName"
              />

              <InputField
                value={payload.mobile}
                setValue={setPayload}
                nameKey="mobile"
              />
            </div>
          )}
          <InputField
            type="text"
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
          />
          <InputField
            type="password"
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
          />
          <Button
            name={isRegister ? `Đăng Ký` : `Đăng Nhập`}
            handleOnclick={handleSubmit}
            fw
          />
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister ? (
              <span className="text-blue-500 hover:underline cursor-pointer">
                Quên mất tài khoản của bạn ?
              </span>
            ) : (
              <span
                onClick={() => setRegister(false)}
                className="text-blue-500 hover:underline cursor-pointer w-full text-center"
              >
                Quay trở lại trang đăng nhập{" "}
              </span>
            )}
            {!isRegister && (
              <span
                onClick={() => setRegister(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Tạo tài khoản ?
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
