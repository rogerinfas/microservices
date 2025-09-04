import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, SALT_ROUNDS } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private toUserResponse(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      username: user.username,
      email: user.email
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if username already exists
    const existingUser = await this.usersRepository.findOne({ 
      where: { username: createUserDto.username } 
    });
    
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password before saving
    const hashedPassword = await this.hashPassword(createUserDto.password);
    
    // Create user with hashed password
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    
    const savedUser = await this.usersRepository.save(user);
    return this.toUserResponse(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map(user => this.toUserResponse(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toUserResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    
    // Check if username is being updated and if it's already taken
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({ 
        where: { username: updateUserDto.username } 
      });
      
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    // Check if email is being updated and if it's already in use
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    // If password is being updated, hash it first
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    return this.toUserResponse(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // This method is used for authentication and needs the password
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
