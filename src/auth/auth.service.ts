import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginregisterDTO } from './dtos/login.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private commonService: CommonService
  ) {}

  async login(body: LoginregisterDTO) {
    const { email, password } = body; 
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      const result = this.commonService.verifyHashPassword(password, existingUser.password);
      if (result) {
        return this.commonService.customSuccessResponse({ id: existingUser.id, token: this.jwtService.sign({ email, id: existingUser.id }) }, "Login Success!", 200)
      } else {
        throw new BadRequestException('email or password is incorrect!');
      }
    } else {
      throw new BadRequestException('email or password is incorrect!');
    }
  }

  async register(body: LoginregisterDTO) {
    const { email, password } = body;
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already Exists!');
    } else {
      const hash = await this.commonService.hashPassword(password)
      await this.usersService.create({email, password: hash})
      return this.commonService.customSuccessResponse(true, "Registration Successful", 200)
    }
  }
}
