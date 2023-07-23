const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async(req, res, next) => {
    // Token gửi lên dạng headers: { authorization: Bearer token }
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        // verify token 
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                msg: `Access token không hợp lệ`
            })
            console.log(decode);
            // decode là password đã được mã hóa thành token
            req.user = decode;
            next();
        });
    }else {
        return res.status(401).json({
            success: false,
            msg: `Bạn phải xác thực thông tin!!!`
        })
    }
});

const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user
    if (role !== 0)
        return res.status(401).json({
            success: false,
            msg: 'Yêu cầu quyền quản trị'
        })
    next()
});

module.exports = {
    verifyAccessToken,
    isAdmin
};