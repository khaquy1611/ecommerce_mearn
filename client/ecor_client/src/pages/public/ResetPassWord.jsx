import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { userResetPassWord } from "../../api";
import { toast } from "react-toastify";
const ResetPassWord = () => {
  const [cofirmPassword, setConfirmPassWord] = useState("");
  const [newPassword, setNewPassWord] = useState("");
  const { token } = useParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResetPassWord = useCallback(async () => {
    if (newPassword !== cofirmPassword) {
      toast.error("Xác nhận mật khẩu không giống. ~ vui lòng nhập lại", {
        theme: "dark",
      });
    } else {
      const response = await userResetPassWord({
        password: newPassword,
        token,
      });
      if (response.success) {
        toast.success(response.mes, {
          theme: "colored",
        });
      } else {
        toast.info(response.mes, {
          theme: "colored",
        });
      }
    }
  });
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        // 👇️ call submit function here
        handleResetPassWord();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleResetPassWord]);
  return (
    <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white z-50 py-8 flex flex-col items-center">
      <div className="flex flex-col gap-4">
        <label htmlFor="email">Nhập mật khẩu mới:</label>
        <input
          type="password"
          id="password"
          className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
          name="password"
          onChange={(e) => setNewPassWord(e.target.value)}
          value={newPassword}
          placeholder="Nhập Mật Khẩu..."
        />
        <label htmlFor="email">Xác nhận mật khẩu:</label>
        <input
          type="password"
          id="password"
          className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
          name="cofirmPassWord"
          onChange={(e) => setConfirmPassWord(e.target.value)}
          value={cofirmPassword}
          placeholder="Nhập Mật Khẩu..."
        />
        <div className="flex items-center justify-end mt-4 w-full gap-4">
          <Button
            name="Xác Nhận"
            style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2"
            handleOnClick={handleResetPassWord}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassWord;
