import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export const SALT_ROUNDS = 10;

@Entity('users')
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, select: false })  // select: false will exclude this field by default from queries
  password: string;

  @Column({ nullable: false })
  email: string;

  // This method will be used to exclude sensitive data when returning user data
  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }
}