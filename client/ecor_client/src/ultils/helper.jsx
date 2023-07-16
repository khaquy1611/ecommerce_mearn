/* eslint-disable no-useless-escape */
import icons from "./icon";

const { AiOutlineStar, AiFillStar } = icons;
// Chuyển chữ tiếng việt có giấu sang không dấu
export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");
// Định dạng tiền tệ
export const formatMoney = (number) =>
  Number(number).toFixed(1).toLocaleString();
// hiển thị ra số sao do người dùng nhập
export const renderStartFromNumber = (number, size) => {
  if (!Number(number)) return;
  const stars = [];
  for (let i = 0; i < +number; i++) {
    stars.push(<AiFillStar color="orange" size={size || 16} />);
  }
  for (let i = 5; i > +number; i--) {
    stars.push(<AiOutlineStar color="orange" size={size || 16} />);
  }
  return stars;
};

// Chuyển thời gian về giờ giấy
export const secondsToHms = (d) => {
  d = Number(d) / 1000;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  return { h, m, s };
};

// kiểm tra validate
export const validate = (payload, setInvalidFields) => {
  let isvalids = 0;
  const formatPayload = Object.entries(payload);
  for (let arr of formatPayload) {
    if (arr[1].trim() === "") {
      isvalids++;
      setInvalidFields((prev) => [
        ...prev,
        { name: arr[0], mes: `Require this fields.` },
      ]);
    }
  }
  for (let arr of formatPayload) {
    switch (arr[0]) {
      case "email":
        {
          const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (!arr[1].match(regex)) {
            isvalids++;
            setInvalidFields((prev) => [
              ...prev,
              { name: arr[0], mes: `Email Invalids` },
            ]);
          }
        }
        break;
      case "password":
        {
          if (arr[1].length < 6) {
            isvalids++;
            setInvalidFields((prev) => [
              ...prev,
              { name: arr[0], mes: `Password minium 6 characters.` },
            ]);
          }
        }
        break;
      default:
        break;
    }
  }
  return isvalids;
};

export const formatPrice = number => Math.round(number / 1000) * 100;