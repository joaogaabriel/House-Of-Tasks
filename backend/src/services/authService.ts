import { User } from "../models/userModel";
import { Login } from "../models/loginModel";

export class AuthService {
  private users: User[] = [];

  login(credentials: Login): boolean {
    const user = this.users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );
    return !!user;
  }
}
