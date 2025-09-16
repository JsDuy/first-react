export default function Login() {
    const inputStyle = {
        border: "1px solid white",
        padding: "5px",
        margin: "20px",
        borderRadius: "10px",
        width: "90%",
        backgroundColor: "#191919",
    }
    return (
        <div className="login">
            <h1 className="font-bold">LOGIN</h1>
            <input type="text" placeholder="User name" style={inputStyle}/>
            <input type="text" placeholder="Password" style={inputStyle}/>
            <button type="submit">Submit</button>
        </div>
    )
}