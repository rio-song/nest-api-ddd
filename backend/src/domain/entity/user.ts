
export class User {
    private id: string
    private lastName: string
    private firstName: string
    private email: string
    private userStatus: string
    public constructor(props: { id: string; lastName: string; firstName: string; email: string; userStatus: string; }) {
        const { id, lastName, firstName, email, userStatus } = props
        this.id = id
        this.lastName = lastName
        this.firstName = firstName
        this.email = email
        this.userStatus = userStatus
    }

    public getAllProperties() {
        return {
            id: this.id,
            lastName: this.lastName,
            firstName: this.firstName,
            email: this.email,
            userStatus: this.userStatus,
        }
    }
}