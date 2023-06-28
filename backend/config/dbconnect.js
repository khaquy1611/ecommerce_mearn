const { default: mongoose } = require("mongoose");
mongoose.set(`strictQuery`, false);
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn.connection.readyState === 1)
      console.log("Kết nối cơ sở dữ liệu thành công");
    else console.log("Đang kết nối tới cơ sở dữ liệu...");
  } catch (error) {
    console.log(`Kết nối cơ sở dữ liệu không thành công`);
    throw new Error(error);
  }
};

module.exports = dbConnect;
