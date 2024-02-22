import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Avatar {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  hash: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
