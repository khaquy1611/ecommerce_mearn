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

export const secondsToHms = (d) => {
  d = Number(d) / 1000;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  return { h, m, s };
};
