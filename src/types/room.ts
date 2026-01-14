import { PaginationQuery } from "./common";

export enum RoomType {
  GENERAL = "GENERAL", // คือ ห้องทั่วไป
  ICU = "ICU", // คือ ห้องผู้ป่วยหนัก
  OPERATING_THEATER = "OPERATING_THEATER", // คือ ห้องผ่าตัด
  RECOVERY = "RECOVERY", // คือ ห้องพักฟื้น
  VIP = "VIP", // คือ ห้องวีไอพี
  SEMI_PRIVATE = "SEMI_PRIVATE", // คือ ห้องกึ่งส่วนตัว
  PRIVATE = "PRIVATE", // คือ ห้องส่วนตัว
}

export interface Room {
  id: number;
  room_number: string;
  building: string;
  floor: number;
  room_type: RoomType;
  capacity: number;
  facilities?: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface RoomCreateBody {
  room_number: string;
  building: string;
  floor: number;
  room_type: RoomType;
  capacity: number;
  facilities?: string[];
  is_active?: boolean;
}

export interface RoomUpdateBody {
  room_number?: string;
  building?: string;
  floor?: number;
  room_type?: RoomType;
  capacity?: number;
  facilities?: string[];
  is_active?: boolean;
}

export interface RoomFilter {
  room_type?: RoomType;
  building?: string;
  floor?: number;
  is_active?: boolean;
  search?: string;
}

export interface RoomQuerystring extends RoomFilter, PaginationQuery {}

export interface RoomTypePrice {
  id: string;
  room_type: string;
  name_en: string;
  name_th: string;
  description?: string;
  base_price_per_day: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RoomTypePriceCreateBody {
  room_type: string;
  name_en: string;
  name_th: string;
  description?: string;
  base_price_per_day: number;
  is_active?: boolean;
}

export interface RoomTypePriceUpdateBody {
  name_en?: string;
  name_th?: string;
  description?: string;
  base_price_per_day?: number;
  is_active?: boolean;
}

export interface RoomTypePriceFilter {
  room_type?: string;
  is_active?: boolean;
  search?: string;
}

export interface RoomTypePriceQuerystring
  extends RoomTypePriceFilter,
    PaginationQuery {}
