/**
 * BACKEND API STRUCTURE FOR LEAVE MANAGEMENT SYSTEM
 * =================================================
 * 
 * BASE URL: http://localhost:5000/api
 * 
 * Add these endpoints to your backend (Node.js/Express, Python/Django, etc.)
 */

// ==================== AUTHENTICATION ENDPOINTS ====================

/**
 * 1. LOGIN ENDPOINT
 * ----------------
 * POST /auth/login
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (Success - 200):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "user_123",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "role": "employee",
 *     "department": "HR"
 *   }
 * }
 * 
 * Response (Error - 401):
 * {
 *   "message": "Invalid email or password"
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.post('/api/auth/login', async (req, res) => {
 *   try {
 *     const { email, password } = req.body;
 *     
 *     // 1. Find user by email in database
 *     const user = await User.findOne({ email });
 *     if (!user) {
 *       return res.status(401).json({ message: "Invalid email or password" });
 *     }
 *     
 *     // 2. Compare password with hashed password
 *     const isValidPassword = await bcrypt.compare(password, user.password);
 *     if (!isValidPassword) {
 *       return res.status(401).json({ message: "Invalid email or password" });
 *     }
 *     
 *     // 3. Generate JWT token (expires in 24 hours)
 *     const token = jwt.sign(
 *       { id: user._id, email: user.email },
 *       process.env.JWT_SECRET,
 *       { expiresIn: '24h' }
 *     );
 *     
 *     // 4. Return token and user data (exclude password)
 *     res.json({
 *       token,
 *       user: {
 *         id: user._id,
 *         email: user.email,
 *         name: user.fullName,
 *         role: user.role,
 *         department: user.department
 *       }
 *     });
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 */

/**
 * 2. REGISTER ENDPOINT
 * --------------------
 * POST /auth/register
 * 
 * Request Body:
 * {
 *   "email": "newuser@example.com",
 *   "password": "password123",
 *   "fullName": "Jane Doe",
 *   "employeeId": "EMP12345"
 * }
 * 
 * Response (Success - 201):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "user_456",
 *     "email": "newuser@example.com",
 *     "name": "Jane Doe",
 *     "role": "employee"
 *   }
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.post('/api/auth/register', async (req, res) => {
 *   try {
 *     const { email, password, fullName, employeeId } = req.body;
 *     
 *     // 1. Check if user already exists
 *     const existingUser = await User.findOne({ email });
 *     if (existingUser) {
 *       return res.status(400).json({ message: "Email already registered" });
 *     }
 *     
 *     // 2. Hash password
 *     const hashedPassword = await bcrypt.hash(password, 10);
 *     
 *     // 3. Create new user
 *     const newUser = new User({
 *       email,
 *       password: hashedPassword,
 *       fullName,
 *       employeeId,
 *       role: 'employee'
 *     });
 *     
 *     await newUser.save();
 *     
 *     // 4. Generate JWT token
 *     const token = jwt.sign(
 *       { id: newUser._id, email: newUser.email },
 *       process.env.JWT_SECRET,
 *       { expiresIn: '24h' }
 *     );
 *     
 *     res.status(201).json({
 *       token,
 *       user: {
 *         id: newUser._id,
 *         email: newUser.email,
 *         name: newUser.fullName,
 *         role: newUser.role
 *       }
 *     });
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 */

/**
 * 3. SET PASSWORD ENDPOINT (For first-time users)
 * -----------------------------------------------
 * POST /auth/set-password
 * 
 * Headers: { "Authorization": "Bearer invitation_token" }
 * Request Body:
 * {
 *   "token": "invitation_token_123",
 *   "password": "newPassword123"
 * }
 * 
 * Response (Success - 200):
 * {
 *   "message": "Password set successfully",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": { id, email, name, role }
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.post('/api/auth/set-password', async (req, res) => {
 *   try {
 *     const { token, password } = req.body;
 *     
 *     // 1. Verify invitation token
 *     const decoded = jwt.verify(token, process.env.INVITE_SECRET);
 *     
 *     // 2. Find user by ID from decoded token
 *     const user = await User.findById(decoded.userId);
 *     if (!user) {
 *       return res.status(404).json({ message: "User not found" });
 *     }
 *     
 *     // 3. Hash and set password
 *     user.password = await bcrypt.hash(password, 10);
 *     user.passwordSet = true;
 *     await user.save();
 *     
 *     // 4. Generate auth token
 *     const authToken = jwt.sign(
 *       { id: user._id, email: user.email },
 *       process.env.JWT_SECRET,
 *       { expiresIn: '24h' }
 *     );
 *     
 *     res.json({
 *       message: "Password set successfully",
 *       token: authToken,
 *       user: { id: user._id, email: user.email, name: user.fullName, role: user.role }
 *     });
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 */

/**
 * 4. FORGOT PASSWORD ENDPOINT
 * ---------------------------
 * POST /auth/forgot-password
 * 
 * Request Body:
 * {
 *   "email": "user@example.com"
 * }
 * 
 * Response (Success - 200):
 * {
 *   "message": "Reset link sent to your email"
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.post('/api/auth/forgot-password', async (req, res) => {
 *   try {
 *     const { email } = req.body;
 *     
 *     // 1. Find user by email
 *     const user = await User.findOne({ email });
 *     if (!user) {
 *       return res.status(404).json({ message: "User not found" });
 *     }
 *     
 *     // 2. Generate reset token (expires in 1 hour)
 *     const resetToken = jwt.sign(
 *       { id: user._id, email: user.email },
 *       process.env.RESET_SECRET,
 *       { expiresIn: '1h' }
 *     );
 *     
 *     // 3. Save token hash to database (for verification)
 *     user.resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
 *     user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
 *     await user.save();
 *     
 *     // 4. Send reset link via email
 *     const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
 *     await sendEmail(user.email, 'Password Reset', `Click here to reset: ${resetLink}`);
 *     
 *     res.json({ message: "Reset link sent to your email" });
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 */

/**
 * 5. RESET PASSWORD ENDPOINT
 * --------------------------
 * POST /auth/reset-password
 * 
 * Request Body:
 * {
 *   "token": "reset_token_from_email",
 *   "newPassword": "newPassword123"
 * }
 * 
 * Response (Success - 200):
 * {
 *   "message": "Password reset successfully"
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.post('/api/auth/reset-password', async (req, res) => {
 *   try {
 *     const { token, newPassword } = req.body;
 *     
 *     // 1. Verify reset token
 *     const decoded = jwt.verify(token, process.env.RESET_SECRET);
 *     
 *     // 2. Find user and verify token hash
 *     const user = await User.findById(decoded.id);
 *     if (!user || new Date() > user.resetTokenExpiry) {
 *       return res.status(400).json({ message: "Reset token expired" });
 *     }
 *     
 *     // 3. Hash new password and update
 *     user.password = await bcrypt.hash(newPassword, 10);
 *     user.resetTokenHash = null;
 *     user.resetTokenExpiry = null;
 *     await user.save();
 *     
 *     res.json({ message: "Password reset successfully" });
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 */

/**
 * 6. GET CURRENT USER ENDPOINT
 * ----------------------------
 * GET /auth/me
 * 
 * Headers: { "Authorization": "Bearer token" }
 * 
 * Response (Success - 200):
 * {
 *   "id": "user_123",
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "role": "employee",
 *   "department": "HR"
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.get('/api/auth/me', authenticateToken, async (req, res) => {
 *   try {
 *     // req.user is set by authenticateToken middleware
 *     const user = await User.findById(req.user.id).select('-password');
 *     res.json(user);
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 class mode {
  public static void main (){
    int i=0;

  }
  static void kaong(int a){
    for(int i=0;i<a;i++>){
      
    }
  }
 }
 */

/**
 * 7. REFRESH TOKEN ENDPOINT
 * -------------------------
 * POST /auth/refresh
 * 
 * Headers: { "Authorization": "Bearer token" }
 * 
 * Response (Success - 200):
 * {
 *   "token": "new_jwt_token"
 * }
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * app.post('/api/auth/refresh', authenticateToken, (req, res) => {
 *   try {
 *     const newToken = jwt.sign(
 *       { id: req.user.id, email: req.user.email },
 *       process.env.JWT_SECRET,
 *       { expiresIn: '24h' }
 *     );
 *     res.json({ token: newToken });
 *   } catch (error) {
 *     res.status(500).json({ message: error.message });
 *   }
 * });
 */

/**
 * MIDDLEWARE: authenticateToken
 * ----------------------------
 * Add this middleware to protected routes
 * 
 * Backend Implementation Example (Node.js/Express):
 * ---
 * const authenticateToken = (req, res, next) => {
 *   const authHeader = req.headers['authorization'];
 *   const token = authHeader && authHeader.split(' ')[1];
 *   
 *   if (!token) {
 *     return res.status(401).json({ message: "No token provided" });
 *   }
 *   
 *   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
 *     if (err) {
 *       return res.status(403).json({ message: "Invalid or expired token" });
 *     }
 *     req.user = user;
 *     next();
 *   });
 * };
 */

// =================================================================
// ENVIRONMENT VARIABLES NEEDED IN BACKEND (.env file)
// =================================================================
/*
DATABASE_URL=mongodb://localhost:27017/leave-management
JWT_SECRET=your_secret_key_here
RESET_SECRET=your_reset_secret_key
INVITE_SECRET=your_invite_secret_key
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@lms.com
API_URL=http://localhost:5000/api
*/

// =================================================================
// USER MODEL SCHEMA (MongoDB Example)
// =================================================================
/*
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (hashed, required),
  fullName: String (required),
  employeeId: String (unique),
  role: String (employee, manager, admin, default: 'employee'),
  department: String,
  profilePicture: String (URL),
  isActive: Boolean (default: true),
  emailVerified: Boolean (default: false),
  passwordSet: Boolean (default: false),
  resetTokenHash: String (nullable),
  resetTokenExpiry: Date (nullable),
  createdAt: Date,
  updatedAt: Date
}
*/

export default "Backend API Structure Documentation";
