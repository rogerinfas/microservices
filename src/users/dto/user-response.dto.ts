export class UserResponseDto {
  id: number;
  username: string;
  email: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
