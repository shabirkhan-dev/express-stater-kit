import { AuthController } from "./controllers/auth";
import { AuthService } from "./services/auth";


const authService = new AuthService();
const authController = new AuthController(authService);

export { authController, authService };