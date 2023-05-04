function generateOTP() {
    const candidate = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let result = "";
    for (let i = 0; i < 4; i++) {
        result += candidate[Math.floor(Math.random() * 10)]
    }

    return result;
}

module.exports = generateOTP;