import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class MongoIdDTO {
  @IsMongoId()
  id: string;
}
