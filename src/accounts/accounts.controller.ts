import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  // ParseIntPipe — URL 파라미터를 string → number 변환
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountsService.createAccount(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccountDto) {
    return this.accountsService.updateAccount(id, dto);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.removeAccount(id);
  }
}
