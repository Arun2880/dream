// utils/generateReferralCode.js
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let referralCode = '';
  for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      referralCode += chars[randomIndex];
  }
  return referralCode;
};

module.exports = generateReferralCode;