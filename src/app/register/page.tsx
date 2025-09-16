import Link from "next/link";

export default function Register() {
    return (
        <div>
            <h1>Register Now!</h1>
            <input type="text" placeholder="User name" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Password"/>
            <input type="text" placeholder="Password Confilm" />
            <input type="text" placeholder="Phone" />
            <p>You had an account? <Link href="/login">Login Now!</Link></p>
        </div>
    )
}