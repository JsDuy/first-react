import Link from "next/link";

export default function Register() {
    const inputStyle = {
        border: "1px solid white",
        padding: "5px",
        margin: "20px",
        borderRadius: "10px",
        width: "90%",
        backgroundColor: "#191919",
    }
    return (
        <div className="register">
            <h1 className="font-bold">REGISTER NOW!</h1>
            <input type="text" placeholder="User name" style={inputStyle}/>
            <input type="text" placeholder="Email" style={inputStyle}/>
            <input type="text" placeholder="Password" style={inputStyle}/>
            <input type="text" placeholder="Password Confilm" style={inputStyle}/>
            <input type="text" placeholder="Phone" style={inputStyle}/>
            <p>You had an account? <Link href="/login" className="underline ask-login">Login Now!</Link></p>
        </div>
    )
}