import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// entity
import { User } from './entities/user.entity';

// contracts
import { UserDto, CreateUserDto, UpdateUserDto, UserBaseDto, ConfirmMailDto, WelcomeMailDto, ResetPasswordDto, ResetPasswordMailDto, OnboardingMailDto } from '@app/contracts';

// service
import { MailService } from '@app/modules/messaging/src/mail/mail.service';

// page-meta
import { PageDto } from 'apps/common/dto/page.dto';
import { PageMetaDto } from 'apps/common/dto/page-meta.dto';
import { PageOptionsDto } from 'apps/common/dto/page-optional.dto';
import { UserQueryPageOptionDto } from 'apps/aleva-api-gateway/src/auth/modules/users/page-options/page-query.dto';



@Injectable()
export class UsersService {

  constructor(
    private mailService: MailService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto, tag: string = null): Promise<User> {
    createUserDto.verification_token = uuidv4();
    createUserDto.is_verified = false;

    const newUser = await this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);

    // verification link
    const apiUrl = this.configService.get<string>('API_URL');
    const verificationLink = `${apiUrl}/auth/verify-email?email=${user.email}&token=${user.verification_token}`;

    // send verification mail
    if (!tag || typeof tag !== 'string') {
      await this.mailService.sendVerificationMail({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        verify_link: verificationLink
      } as ConfirmMailDto);
    }

    // send onboarding mail
    if (tag as string == "onboarding") {
      await this.mailService.sendWelcomeMail({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_id: user.user_id
      } as WelcomeMailDto);

    }

    return user;
  }

  async findAll(pageOptionsDto: UserQueryPageOptionDto): Promise<PageDto<UserDto>> {
    const options = plainToInstance(PageOptionsDto, pageOptionsDto);
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .leftJoinAndSelect('user.attendance_logs', 'attendance_logs')
      .addSelect('attendance_logs.user_id')
      .orderBy('user.created_at', pageOptionsDto.order)
      .skip(options.skip)
      .take(options.limit);

    if (pageOptionsDto.user_status === 'is_approved') {
      queryBuilder.andWhere('user.is_approved = :is_approved', { is_approved: true });
    } else if (pageOptionsDto.user_status === 'is_disabled') {
      queryBuilder.andWhere('user.is_disabled = :is_disabled', { is_disabled: true });
    } else if (pageOptionsDto.user_status === 'is_verified') {
      queryBuilder.andWhere('user.is_verified = :is_verified', { is_verified: true });
    } else if (pageOptionsDto.user_status === 'is_subscribed') {
      queryBuilder.andWhere('user.is_subscribed = :is_subscribed', { is_subscribed: true });
    } else if (pageOptionsDto.user_status === 'is_onboarded') {
      queryBuilder.andWhere('user.is_onboarded = :is_onboarded', { is_onboarded: true });
    } else if (pageOptionsDto.user_status === 'is_rejected') {
      queryBuilder.andWhere('user.is_rejected = :is_rejected', { is_rejected: true });
    }
    queryBuilder.orderBy('user.created_at', pageOptionsDto.order)
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

  async findByUserIds(userIds: string[]): Promise<UserBaseDto[]> {
    if (!userIds.every(id => isUUID(id))) {
      throw new BadRequestException('One or more user IDs are invalid');
    }

    const users = await this.userRepository.findBy({ user_id: In(userIds) });

    if (!users.length) {
      throw new NotFoundException('No users found for the provided user IDs');
    }

    return plainToInstance(UserBaseDto, users, { excludeExtraneousValues: true });
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

  // find a user by email
  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    const user = this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      return null
      // throw new NotFoundException(`User with email ${email} not found`);
    }

    return plainToInstance(UserDto, user, { excludeExtraneousValues: false });
  }

  // validate password reset token
  async validateResetToken(email: string, token: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return false;
    }

    return token === user.reset_token;
  }

  // update user's password
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    user.reset_token = "";
    await this.userRepository.save(user);
  }

  // set reset token
  async setResetToken(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    user.reset_token = uuidv4();
    await this.userRepository.save(user);

    // reset link
    const feBaseUrl = this.configService.get<string>('FE_BASE_URL');
    const resetLink = `${feBaseUrl}/account/change-password?email=${user.email}&token=${user.reset_token}`;

    // send reset token link
    if (user) {
      await this.mailService.sendPasswordResetMail({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        reset_link: resetLink
      } as ResetPasswordMailDto);
    }
  }

  // verify email token
  async verifyEmailToken(token: string): Promise<User | boolean> {
    const user = await this.userRepository.findOne({ where: { verification_token: token } });

    // mark email as verified
    await this.markEmailAsVerified(token);

    // send welcome email
    if (user) {
      await this.mailService.sendWelcomeMail({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_id: user.user_id
      } as WelcomeMailDto);
    }

    return user || null;
  }

  // mark email as verified
  async markEmailAsVerified(token: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { verification_token: token } });

    if (!user) {
      throw new NotFoundException(`Verification token ${token} is invalid`);
    }

    user.is_verified = true;
    user.verification_token = "";
    await this.userRepository.save(user);
  }

  // unsubscribe user from emails
  async unsubscribeFromEmails(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.is_subscribed = false;
    await this.userRepository.save(user);
  }

  // subscribe user to emails
  async subscribeToEmails(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.is_subscribed = true;
    await this.userRepository.save(user);
  }
}