// Chuyển chữ tiếng việt có giấu sang không dấu
export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-');