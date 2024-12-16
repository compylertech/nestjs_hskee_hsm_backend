import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { User } from './entities/user.entity';

// contracts
import { UserDto, CreateUserDto, UpdateUserDto } from '@app/contracts';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .leftJoinAndSelect('user.attendance_logs', 'attendance_logs')
      .addSelect('attendance_logs.user_id')
      .orderBy('user.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const transformedEntities = plainToInstance(UserDto, entities, { excludeExtraneousValues: false });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.getUserEntityById(id);

    return plainToInstance(UserDto, user, { excludeExtraneousValues: false });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.getUserEntityById(id);

    // merge the updates into the User entity
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    await this.userRepository.save(updatedUser);

    return plainToInstance(UserDto, updatedUser, { excludeExtraneousValues: false });
  }

  async remove(id: string): Promise<void> {
    const user = await this.getUserEntityById(id);
    await this.userRepository.remove(user);
  }

  private async getUserEntityById(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const user = await this.userRepository.findOne({ where: { user_id: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Find a user by email
  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    const user = this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return plainToInstance(UserDto, user, { excludeExtraneousValues: false });
  }

  // Validate password reset token
  async validateResetToken(email: string, token: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return false;
    }

    return token === user.reset_token;
  }

  // Update user's password
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  // Verify email token
  async verifyEmailToken(token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { verification_token: token } });
    return !!user;
  }

  // Mark email as verified
  async markEmailAsVerified(token: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { verification_token: token } });

    if (!user) {
      throw new NotFoundException(`Verification token ${token} is invalid`);
    }

    user.is_verified = true;
    await this.userRepository.save(user);
  }

  // Unsubscribe user from emails
  async unsubscribeFromEmails(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.is_subscribed = false;
    await this.userRepository.save(user);
  }

  // Subscribe user to emails
  async subscribeToEmails(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.is_subscribed = true;
    await this.userRepository.save(user);
  }
}