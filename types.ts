export enum UserRole {
  CUSTOMER = 'customer',
  WORKER = 'worker',
}

export enum JobStatus {
  OPEN = 'Open',
  AWAITING_PAYMENT = 'Awaiting Payment',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  address?: string;
  phone?: string;
  skill?: string;
  experience?: number;
  idUrl?: string;
  rating: number;
  reviews: number;
  avatarUrl: string;
}

export interface Job {
  id: string;
  customerId: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  imageUrl?: string;
  status: JobStatus;
  createdAt: Date;
  workerId?: string;
  price?: number;
}

export interface Bid {
  id: string;
  jobId: string;
  workerId: string;
  price: number;
  message: string;
  estimatedTime: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  isProof?: boolean;
  timestamp: Date;
}