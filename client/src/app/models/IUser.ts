import { IUserDetails } from './IUserDetails';

export interface IUser {
  id: number,
  username: string,
  email: string,
  active: number,
  details?: IUserDetails,
  facebookId?: number
}