import { useState, useCallback, useEffect } from "react";
import bg_login from "../../assets/bg_login.jpg";
import { InputField, Button } from "../../components";
import { userRegister, userLogin, userForgotPassWord } from "../../api/user";
import Swal from "sweetalert2";
import { login } from "../../store/users/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { toast } from "react-toastify";
import { validate } from "../../ultils/helper";
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
  const [invalidFields, setInvalidFields] = useState([]);
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
    if (response.success) {
      toast.success(response.mes, {
        theme: "colored",
      });
    } else {
      toast.info(response.mes, {
        theme: "colored",
      });
    }
  };

  //

  const handleSubmit = useCallback(async () => {
    const invalids = isRegister
      ? validate(payload, setInvalidFields)
      : validate({ email, password }, setInvalidFields);
    if (invalids == 0) {
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
          login({
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
  }
  }, [dispatch, email, isRegister, navigate, password, payload]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        // 👇️ call submit function here

        handleSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleSubmit]);

  useEffect(() => {
    if (isRegister) {
      resetPayload();
    }
  }, [isRegister]);
  return (
    <div className="w-screen h-screen relative">
      {isForgotPassWord && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white z-50 py-8 flex flex-col items-center">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Nhập Email:</label>
            <input
              type="text"
              id="email"
              className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
              name="email"
              onChange={(e) => setEmailForgot(e.target.value)}
              value={emailForgot}
              placeholder="Exp: email@gmail.com"
            />
            <div className="flex items-center justify-end mt-4 w-full gap-4">
              <Button
                name="Xác Nhận"
                style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2"
                handleOnClick={handleForgotPassWord}
              />
              <Button
                name="Quay lại"
                handleOnClick={() => setIsForgotPassWord(false)}
              />
            </div>
          </div>
        </div>
      )}
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
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputField
                value={payload.lastName}
                setValue={setPayload}
                nameKey="lastName"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />

              <InputField
                value={payload.mobile}
                setValue={setPayload}
                nameKey="mobile"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          )}
          <InputField
            type="text"
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <InputField
            type="password"
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button
            name={isRegister ? `Đăng Ký` : `Đăng Nhập`}
            handleOnClick={handleSubmit}
            fw
          />
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister ? (
              <span
                onClick={() => setIsForgotPassWord(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
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
