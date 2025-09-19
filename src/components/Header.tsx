import Link from "next/link";

export default function Header() {
    const linkStyle = {
        border: "2px solid white",
        padding: "7px",
        borderRadius: "20px",
        marginRight: "10px"
    }
    return (
        <nav className="header">
            <div className="ml-7">
                <img 
                src="https://pngimg.com/d/ibm_PNG19649.png" 
                alt="Logo" 
                className="mt-4 sm:w-[30px]"/>
            </div>
            <div className="flex-6 text-right pr-4">
                <div>
                    <h4 className="mb-6 text-red-200 md:text-sm"><i>Nguyen Hai Duy | Practive ReactJs with Next.js</i></h4>
                </div>
                <div>
                    <Link href="/" style={linkStyle}>Home</Link>
                    <Link href="/register" style={linkStyle}>Register</Link>
                    <Link href="/nowplaying" style={linkStyle}>Now Playing</Link>
                </div>
            </div>
        </nav>
    )
}