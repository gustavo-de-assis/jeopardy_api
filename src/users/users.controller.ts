import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() createUserDto: any) {
        const user = await this.usersService.create(createUserDto);
        const { password, ...result } = user.toObject();
        return result;
    }
}
