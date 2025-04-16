import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface TenantAttributes {
  id?: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class Tenant extends Model<TenantAttributes> implements TenantAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description!: string;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Tenant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Tenant',
    tableName: 'tenants',
    timestamps: false,
  }
); 