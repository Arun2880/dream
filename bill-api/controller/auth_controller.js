const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


//register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const hashPassword = await bcrypt.hash(password, 12);
    const newuser = new User({

      username,
      email,
      password: hashPassword,
    });
    console.log("dzfdgd", hashPassword, newuser);
    await newuser.save()
    res.status(201).json({ message: 'User created successfully', success: true })
  }

  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false })
  }

}





//login
const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User doesn't exist. Please register first.", success: false });
    }

    
    

    // Compare the provided password with the stored hash using bcrypt.compare()
    const checkPassword = await bcrypt.compare(password, existingUser.password);

    
    if (!checkPassword) {
      return res.status(400).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    // Create a JWT token if password is correct
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role, email: existingUser.email, username: existingUser.username },
      'CLIENT_SECRET_KEY', 
      { expiresIn: '60m' }  // Token expiration time
    );
 
    // Send the token in the response
    res.cookie('token', token, { httpOnly: true, secure: false }).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        email: existingUser.email,
        role: existingUser.role,
        id: existingUser._id,
        username: existingUser.username,
      },
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};



// logout

const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'logged out successfully', success: true, });
};




// auth- middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) 
    return res.status(401).json({
    message: 'Unauthorized user',
    success: false,

  });


  try {
    const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
    req.user = decoded;
    next();

  }
  catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized user',
    });
  }
}


module.exports = { register, Login, logout, authMiddleware };