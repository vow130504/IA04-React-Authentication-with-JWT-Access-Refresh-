import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class User {
  @Prop({ type: String, required: true, unique: true, index: true })
  email!: string; // <-- definite assignment

  @Prop({ type: String, required: true })
  password!: string; // <-- definite assignment

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date; // <-- definite assignment
}

export const UserSchema = SchemaFactory.createForClass(User);
