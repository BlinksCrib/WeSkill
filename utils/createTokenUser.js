const createTokenUser = (user) => {
  return { userId: user._id, role: user.role, email: user.email, uName: user.uName };
}

export default createTokenUser
