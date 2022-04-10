import { User } from '../entity/user'

export interface IUserRepository {
    save(User: User): Promise<User>
    changeUserStatus(User: User): Promise<User>
}
