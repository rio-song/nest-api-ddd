
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
        if (userStatus === "studying" || userStatus === "breaking" || userStatus === "withdraw") {
            this.userStatus = userStatus
        } else {
            throw new Error("使用できない名称です")
        }
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

    public getUserId() {
        return {
            id: this.id
        }
    }
}