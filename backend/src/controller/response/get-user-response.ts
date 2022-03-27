import { ApiProperty } from '@nestjs/swagger'
import { UserDTO } from 'src/app/query-service-interface/user-qs'

export class GetUserResponse {
    @ApiProperty({ type: () => [User] })
    User: User[]

    public constructor(params: { Users: UserDTO[] }) {
        const { Users } = params
        this.User = Users.map(({ id, firstName, lastName, email, userStatus }) => {
            return new User({
                id,
                firstName,
                lastName,
                email,
                userStatus

            })
        })
    }
}

class User {
    @ApiProperty()
    id: string

    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string

    @ApiProperty()
    email: string

    @ApiProperty()
    userStatus: string

    public constructor(params: {
        id: string
        firstName: string
        lastName: string
        email: string
        userStatus: string
    }) {
        this.id = params.id
        this.firstName = params.firstName
        this.lastName = params.lastName
        this.email = params.email
        this.userStatus = params.userStatus
    }
}
