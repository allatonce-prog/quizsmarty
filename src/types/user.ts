import { UserStats } from './achievement';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  isAnonymous: boolean;
  avatarUrl?: string;
  createdAt: string;
  stats: UserStats;
}
