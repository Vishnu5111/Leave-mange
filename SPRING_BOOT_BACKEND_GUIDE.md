/**
 * SPRING BOOT BACKEND - FRONTEND INTEGRATION GUIDE
 * ==================================================
 * 
 * This guide shows what your friend needs to implement in Spring Boot
 * for your React frontend to work properly.
 * 
 * Frontend is ready! Backend must follow this structure.
 */

// ==================== SPRING BOOT SETUP ====================

/**
 * 1. Spring Boot Dependencies (pom.xml)
 * 
 * <dependency>
 *     <groupId>org.springframework.boot</groupId>
 *     <artifactId>spring-boot-starter-web</artifactId>
 * </dependency>
 * 
 * <dependency>
 *     <groupId>org.springframework.boot</groupId>
 *     <artifactId>spring-boot-starter-security</artifactId>
 * </dependency>
 * 
 * <dependency>
 *     <groupId>org.springframework.boot</groupId>
 *     <artifactId>spring-boot-starter-data-jpa</artifactId>
 * </dependency>
 * 
 * <dependency>
 *     <groupId>io.jsonwebtoken</groupId>
 *     <artifactId>jjwt-api</artifactId>
 *     <version>0.11.5</version>
 * </dependency>
 * 
 * <dependency>
 *     <groupId>org.springframework.boot</groupId>
 *     <artifactId>spring-boot-starter-mail</artifactId>
 * </dependency>
 */

// ==================== SPRING BOOT PROPERTIES ====================

/**
 * application.properties (or application.yml)
 * 
 * Server Port:
 * server.port=8080
 * 
 * Database:
 * spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
 * spring.datasource.username=root
 * spring.datasource.password=your_password
 * spring.jpa.hibernate.ddl-auto=update
 * 
 * JWT:
 * jwt.secret=your_secret_key_with_minimum_256_bits_long
 * jwt.expiration=86400000
 * 
 * CORS Configuration:
 * app.cors.allowedOrigins=http://localhost:3000,http://localhost:5173
 */

// ==================== SPRING BOOT CONTROLLER STRUCTURE ====================

/**
 * 1. USER ENTITY
 * 
 * @Entity
 * @Table(name = "users")
 * public class User {
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.IDENTITY)
 *     private Long id;
 *     
 *     @Column(unique = true, nullable = false)
 *     private String email;
 *     
 *     @Column(nullable = false)
 *     private String password;
 *     
 *     @Column(nullable = false)
 *     private String fullName;
 *     
 *     @Column(unique = true)
 *     private String employeeId;
 *     
 *     @Enumerated(EnumType.STRING)
 *     private Role role; // EMPLOYEE, MANAGER, ADMIN
 *     
 *     private String department;
 *     private boolean emailVerified;
 *     private boolean passwordSet;
 *     
 *     @CreationTimestamp
 *     private LocalDateTime createdAt;
 *     
 *     @UpdateTimestamp
 *     private LocalDateTime updatedAt;
 * }
 */

// ==================== LOGIN ENDPOINT ====================

/**
 * REQUEST:
 * POST http://localhost:8080/api/auth/login
 * Content-Type: application/json
 * 
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * RESPONSE (200 OK):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": 1,
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "role": "EMPLOYEE",
 *     "department": "HR"
 *   }
 * }
 * 
 * RESPONSE (401 Unauthorized):
 * {
 *   "message": "Invalid email or password"
 * }
 * 
 * Spring Boot Controller:
 * 
 * @RestController
 * @RequestMapping("/api/auth")
 * @CrossOrigin(origins = "http://localhost:5173")
 * public class AuthController {
 *     
 *     @Autowired
 *     private UserService userService;
 *     
 *     @Autowired
 *     private JwtTokenProvider jwtTokenProvider;
 *     
 *     @PostMapping("/login")
 *     public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
 *         try {
 *             User user = userService.findByEmail(loginRequest.getEmail());
 *             
 *             if (user == null) {
 *                 return ResponseEntity.status(401)
 *                     .body(new ErrorResponse("Invalid email or password"));
 *             }
 *             
 *             if (!passwordMatches(loginRequest.getPassword(), user.getPassword())) {
 *                 return ResponseEntity.status(401)
 *                     .body(new ErrorResponse("Invalid email or password"));
 *             }
 *             
 *             String token = jwtTokenProvider.generateToken(user);
 *             
 *             LoginResponse response = new LoginResponse();
 *             response.setToken(token);
 *             response.setUser(new UserDTO(user));
 *             
 *             return ResponseEntity.ok(response);
 *         } catch (Exception e) {
 *             return ResponseEntity.status(500)
 *                 .body(new ErrorResponse(e.getMessage()));
 *         }
 *     }
 * }
 */

// ==================== REGISTER ENDPOINT ====================

/**
 * REQUEST:
 * POST http://localhost:8080/api/auth/register
 * Content-Type: application/json
 * 
 * {
 *   "email": "newuser@example.com",
 *   "password": "password123",
 *   "fullName": "Jane Doe",
 *   "employeeId": "EMP12345"
 * }
 * 
 * RESPONSE (201 Created):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": 2,
 *     "email": "newuser@example.com",
 *     "name": "Jane Doe",
 *     "role": "EMPLOYEE"
 *   }
 * }
 * 
 * Spring Boot Code:
 * 
 * @PostMapping("/register")
 * public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
 *     try {
 *         if (userService.emailExists(registerRequest.getEmail())) {
 *             return ResponseEntity.status(400)
 *                 .body(new ErrorResponse("Email already registered"));
 *         }
 *         
 *         User newUser = new User();
 *         newUser.setEmail(registerRequest.getEmail());
 *         newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
 *         newUser.setFullName(registerRequest.getFullName());
 *         newUser.setEmployeeId(registerRequest.getEmployeeId());
 *         newUser.setRole(Role.EMPLOYEE);
 *         
 *         User savedUser = userService.save(newUser);
 *         String token = jwtTokenProvider.generateToken(savedUser);
 *         
 *         LoginResponse response = new LoginResponse();
 *         response.setToken(token);
 *         response.setUser(new UserDTO(savedUser));
 *         
 *         return ResponseEntity.status(201).body(response);
 *     } catch (Exception e) {
 *         return ResponseEntity.status(500)
 *             .body(new ErrorResponse(e.getMessage()));
 *     }
 * }
 */

// ==================== SET PASSWORD ENDPOINT ====================

/**
 * REQUEST:
 * POST http://localhost:8080/api/auth/set-password
 * Content-Type: application/json
 * Authorization: Bearer token
 * 
 * {
 *   "token": "invitation_token",
 *   "password": "newPassword123"
 * }
 * 
 * RESPONSE (200 OK):
 * {
 *   "message": "Password set successfully",
 *   "token": "new_jwt_token",
 *   "user": { ... }
 * }
 * 
 * Spring Boot Code:
 * 
 * @PostMapping("/set-password")
 * public ResponseEntity<?> setPassword(@RequestBody SetPasswordRequest request) {
 *     try {
 *         User user = userService.findByInvitationToken(request.getToken());
 *         
 *         if (user == null || user.isPasswordSet()) {
 *             return ResponseEntity.status(400)
 *                 .body(new ErrorResponse("Invalid or expired token"));
 *         }
 *         
 *         user.setPassword(passwordEncoder.encode(request.getPassword()));
 *         user.setPasswordSet(true);
 *         userService.save(user);
 *         
 *         String newToken = jwtTokenProvider.generateToken(user);
 *         
 *         SetPasswordResponse response = new SetPasswordResponse();
 *         response.setMessage("Password set successfully");
 *         response.setToken(newToken);
 *         response.setUser(new UserDTO(user));
 *         
 *         return ResponseEntity.ok(response);
 *     } catch (Exception e) {
 *         return ResponseEntity.status(500)
 *             .body(new ErrorResponse(e.getMessage()));
 *     }
 * }
 */

// ==================== FORGOT PASSWORD ENDPOINT ====================

/**
 * REQUEST:
 * POST http://localhost:8080/api/auth/forgot-password
 * Content-Type: application/json
 * 
 * {
 *   "email": "user@example.com"
 * }
 * 
 * RESPONSE (200 OK):
 * {
 *   "message": "Reset link sent to your email"
 * }
 * 
 * Spring Boot Code:
 * 
 * @PostMapping("/forgot-password")
 * public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
 *     try {
 *         User user = userService.findByEmail(request.getEmail());
 *         
 *         if (user == null) {
 *             return ResponseEntity.status(404)
 *                 .body(new ErrorResponse("User not found"));
 *         }
 *         
 *         String resetToken = jwtTokenProvider.generateToken(user);
 *         user.setResetToken(resetToken);
 *         user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
 *         userService.save(user);
 *         
 *         // Send email with reset link
 *         emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
 *         
 *         return ResponseEntity.ok(new MessageResponse("Reset link sent to your email"));
 *     } catch (Exception e) {
 *         return ResponseEntity.status(500)
 *             .body(new ErrorResponse(e.getMessage()));
 *     }
 * }
 */

// ==================== RESET PASSWORD ENDPOINT ====================

/**
 * REQUEST:
 * POST http://localhost:8080/api/auth/reset-password
 * Content-Type: application/json
 * 
 * {
 *   "token": "reset_token_from_email",
 *   "newPassword": "newPassword123"
 * }
 * 
 * RESPONSE (200 OK):
 * {
 *   "message": "Password reset successfully"
 * }
 * 
 * Spring Boot Code:
 * 
 * @PostMapping("/reset-password")
 * public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
 *     try {
 *         User user = userService.findByResetToken(request.getToken());
 *         
 *         if (user == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
 *             return ResponseEntity.status(400)
 *                 .body(new ErrorResponse("Reset token expired"));
 *         }
 *         
 *         user.setPassword(passwordEncoder.encode(request.getNewPassword()));
 *         user.setResetToken(null);
 *         user.setResetTokenExpiry(null);
 *         userService.save(user);
 *         
 *         return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
 *     } catch (Exception e) {
 *         return ResponseEntity.status(500)
 *             .body(new ErrorResponse(e.getMessage()));
 *     }
 * }
 */

// ==================== GET CURRENT USER ENDPOINT ====================

/**
 * REQUEST:
 * GET http://localhost:8080/api/auth/me
 * Authorization: Bearer token
 * 
 * RESPONSE (200 OK):
 * {
 *   "id": 1,
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "role": "EMPLOYEE",
 *   "department": "HR"
 * }
 * 
 * Spring Boot Code:
 * 
 * @GetMapping("/me")
 * @PreAuthorize("isAuthenticated()")
 * public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
 *     try {
 *         User user = userService.findByEmail(userDetails.getUsername());
 *         return ResponseEntity.ok(new UserDTO(user));
 *     } catch (Exception e) {
 *         return ResponseEntity.status(500)
 *             .body(new ErrorResponse(e.getMessage()));
 *     }
 * }
 */

// ==================== JWT TOKEN PROVIDER ====================

/**
 * JWT Token Configuration
 * 
 * @Component
 * public class JwtTokenProvider {
 * 
 *     @Value("${jwt.secret}")
 *     private String jwtSecret;
 *     
 *     @Value("${jwt.expiration}")
 *     private long jwtExpirationMs;
 *     
 *     public String generateToken(User user) {
 *         return Jwts.builder()
 *             .setSubject(user.getEmail())
 *             .claim("id", user.getId())
 *             .claim("role", user.getRole())
 *             .setIssuedAt(new Date())
 *             .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
 *             .signWith(SignatureAlgorithm.HS512, jwtSecret)
 *             .compact();
 *     }
 *     
 *     public String getUserEmailFromToken(String token) {
 *         return Jwts.parser()
 *             .setSigningKey(jwtSecret)
 *             .parseClaimsJws(token)
 *             .getBody()
 *             .getSubject();
 *     }
 *     
 *     public boolean validateToken(String token) {
 *         try {
 *             Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
 *             return true;
 *         } catch (JwtException | IllegalArgumentException e) {
 *             return false;
 *         }
 *     }
 * }
 */

// ==================== CORS CONFIGURATION ====================

/**
 * Enable CORS for Frontend Communication
 * 
 * @Configuration
 * public class CorsConfig implements WebMvcConfigurer {
 * 
 *     @Override
 *     public void addCorsMappings(CorsRegistry registry) {
 *         registry.addMapping("/api/**")
 *             .allowedOrigins("http://localhost:5173", "http://localhost:3000")
 *             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
 *             .allowedHeaders("*")
 *             .allowCredentials(true)
 *             .maxAge(3600);
 *     }
 * }
 */

// ==================== REQUEST/RESPONSE CLASSES ====================

/**
 * LoginRequest.java
 * 
 * public class LoginRequest {
 *     private String email;
 *     private String password;
 *     // getters and setters
 * }
 * 
 * RegisterRequest.java
 * 
 * public class RegisterRequest {
 *     private String email;
 *     private String password;
 *     private String fullName;
 *     private String employeeId;
 *     // getters and setters
 * }
 * 
 * LoginResponse.java
 * 
 * public class LoginResponse {
 *     private String token;
 *     private UserDTO user;
 *     // getters and setters
 * }
 * 
 * UserDTO.java
 * 
 * public class UserDTO {
 *     private Long id;
 *     private String email;
 *     private String name;
 *     private String role;
 *     private String department;
 *     
 *     public UserDTO(User user) {
 *         this.id = user.getId();
 *         this.email = user.getEmail();
 *         this.name = user.getFullName();
 *         this.role = user.getRole().toString();
 *         this.department = user.getDepartment();
 *     }
 * }
 * 
 * ErrorResponse.java
 * 
 * public class ErrorResponse {
 *     private String message;
 *     private LocalDateTime timestamp;
 *     
 *     public ErrorResponse(String message) {
 *         this.message = message;
 *         this.timestamp = LocalDateTime.now();
 *     }
 * }
 */

// ==================== DATABASE SETUP ====================

/**
 * For MySQL:
 * 1. Create database: CREATE DATABASE lms_db;
 * 2. Spring JPA will create tables automatically with ddl-auto=update
 * 
 * For PostgreSQL:
 * Change datasource.url to: jdbc:postgresql://localhost:5432/lms_db
 */

// ==================== FRONTEND READY ====================

/**
 * YOUR REACT FRONTEND IS READY!
 * 
 * The frontend has been built to work with this Spring Boot structure.
 * 
 * Just need to make sure:
 * 1. Spring Boot runs on http://localhost:8080
 * 2. API endpoints follow the structure above
 * 3. Token is returned in the response as "token"
 * 4. User object matches the UserDTO structure
 * 5. Errors are returned as { "message": "error text" }
 * 
 * Test with Postman first before running with React frontend!
 */
