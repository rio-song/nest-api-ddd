import { User } from '../entity/user'

export interface IUserRepository {
    save(User: User): Promise<User>
    update(User: User): Promise<User>
}
