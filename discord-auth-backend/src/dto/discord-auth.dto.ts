import { IsNotEmpty, IsString } from 'class-validator';

export class DiscordAuthDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
