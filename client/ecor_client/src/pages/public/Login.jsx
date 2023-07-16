import { useState, useCallback, useEffect } from "react";
import bg_login from "../../assets/bg_login.jpg";
import { InputField, Button } from "../../components";
import {
  userRegister,
  userLogin,
  userForgotPassWord,
  userFinalRegister,
} from "../../api/user";
import Swal from "sweetalert2";
import { login } from "../../store/users/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { toast } from "react-toastify";
import { validate } from "../../ultils/helper";
import { Link } from "react-router-dom";

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
  const [token, setToken] = useState("");
  const [isVerifyEmail, setIssVerifyEmail] = useState(false);
  const { email, password } = payload;
  const [isRegister, setRegister] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
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
          setIssVerifyEmail(true);
        } else {
          Swal.fire(`Oops!!`, response?.mes, "error");
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

  const finalRegister = async () => {
    if (token !== "") {
      const response = await userFinalRegister(token);
      if (response?.success) {
        Swal.fire(`Congratulation`, response?.mes, "success").then(() => {
          setRegister(false);
          resetPayload();
        });
      } else {
        Swal.fire(`Oops!!`, response?.mes, "error");
      }
      setIssVerifyEmail(false);
      setToken("");
    } else {
      Swal.fire(`Oops!!`, `Mã xác thực bị rỗng`, "error");
    }
  };

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

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
      setIssVerifyEmail(false);
    }
    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      if (timeLeft > 0 && isVerifyEmail) setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft, isVerifyEmail]);

  return (
    <div className="w-screen h-screen relative">
      {isVerifyEmail && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
          <div className="bg-white w-[500px] rounded-md p-8">
            <div className="p-8 w-[120px] h-[120px] bg-white border border-2 border-rose-600 rounded-full text-gray-800 text-[13px] font-semibold">
              Thời gian còn lại:{timeLeft}
            </div>
            <h4>
              Chúng tôi đã gửi mã code kích hoạt đến email của bạn. Vui lòng
              kiểm tra email và nhập mã code của bạn vào.
            </h4>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-2 border rounded-md outline-none"
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4"
              onClick={() => finalRegister()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
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
                style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2"
                handleOnClick={handleForgotPassWord}
              >
                Xác nhận
              </Button>
              <Button handleOnClick={() => setIsForgotPassWord(false)}>
                Quay lại
              </Button>
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
          <Button handleOnClick={handleSubmit} fw>
            {isRegister ? `Đăng Ký` : `Đăng Nhập`}
          </Button>
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
          <Link
            className="text-blue-500 hover:underline cursor-pointer"
            to={`/${path.HOME}`}
          >
            Quay trở về trang chủ ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
