export const passwordPolicy = (password) => {
  const strong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password);

  if (!strong) {
    throw new Error(
      "Password must be 8+ chars, include capital & number"
    );
  }
};