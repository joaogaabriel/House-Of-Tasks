import { User } from "../models/userModel";

export class UserService {
  private users: User[] = [];

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
