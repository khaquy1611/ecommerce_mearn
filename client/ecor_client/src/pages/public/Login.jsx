import { useState, useCallback } from "react";
import bg_login from "../../assets/bg_login.jpg";
import { InputField, Button } from "../../components";
import { userRegister, userLogin, userForgotPassWord } from "../../api/user";
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
  const [isShowModal, setIsShowModal] = useState(false);
  const [isForgotPassWord, setIsForgotPassWord] = useState(false);
  const [emailForgot, setEmailForgot] = useState("");
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
    });
  };
  const handleForgotPassWord = async () => {
      const response = await userForgotPassWord({ email: emailForgot });
      console.log('response', response);          
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
        Swal.fire(`Oops!!`, response?.mes, "error");
      }
    }
  }, [dispatch, email, isRegister, navigate, password, payload]);
  return (
    <div className="w-screen h-screen relative">
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-white z-50 py-8 flex flex-col items-center">
      <div className="flex flex-col gap-4">
      <label htmlFor="email">Enter your email</label>
      <input type="text" id="email" className="w-[800px] pb-2 border-b outline-none placeholder:text-sm" name="email" onChange={(e) => setEmailForgot(e.target.value)} value={emailForgot} placeholder="Exp: email@gmail.com" />
      <div className="flex items-center justify-end mt-4 w-full">
      <Button name="Xác Nhận" handleOnClick={handleForgotPassWord}/>
    </div>
      </div>
    </div>
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
            handleOnClick={handleSubmit}
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
