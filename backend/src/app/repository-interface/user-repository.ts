import { User } from 'src/domain/entity/user'

export interface IUserRepository {
    save(User: User): Promise<User>
}
