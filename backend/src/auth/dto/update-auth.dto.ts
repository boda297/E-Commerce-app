import { PartialType } from '@nestjs/mapped-types';
import { LoginDTO } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(LoginDTO) {}
