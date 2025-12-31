export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roles: string[] | null;
  enabled: boolean;
  groupId: string | null;
  groupName: string | null;
  createdAt: string | null;
  groupIds: string[] | null;
  groupNames: string[] | null;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserDTO;
  expiresAt: string;
}