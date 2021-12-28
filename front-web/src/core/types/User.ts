import { Role } from "core/utils/auth";

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: Roles[];
}

export type UserResponse = {
  content: User[];
  totalPages: number;
}

export type Roles = {
  id?: number;
  authority: Role;
}
