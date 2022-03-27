export class UserDTO {
    public readonly id: string
    public readonly firstName: string
    public readonly lastName: string
    public readonly email: string
    public readonly userStatus: string

    public constructor(props: { id: string; firstName: string; lastName: string; email: string; userStatus: string; }) {
        const { id, firstName, lastName, email, userStatus } = props
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.userStatus = userStatus
    }
}

export interface IUserQS {
    getAllUsers(): Promise<UserDTO[]>
    getUser(email: string): Promise<UserDTO>
    emailDoubleCheck(email: string): Promise<boolean>
}