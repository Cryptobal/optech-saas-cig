import mongoose, { Document, Schema } from 'mongoose';

interface IClient extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar el campo updatedAt
clientSchema.pre('save', function(this: IClient, next: () => void) {
  this.updatedAt = new Date();
  next();
});

export const Client = mongoose.model<IClient>('Client', clientSchema); 