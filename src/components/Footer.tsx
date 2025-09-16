import Link from "next/link";

export default function Footer() {
    return (
        <>
        <hr className="my-4 bg-white h-0.5 w-1/2 justify-self-center -mb-2" />
        <section className="p-7 footer">
            <div className="flex-3 p-4">
                <img 
                src="https://pngimg.com/d/ibm_PNG19649.png" 
                alt="Logo" 
                width="150"
                className="mt-4 mb-2"/>
                <p className="text-justify">Có một sự thật là: không ai rỗi hơi để trách một đứa trẻ hay làm điều xấu, 
                    nhưng lại tán dương hết lời khi nó làm được điều tốt. Cũng chẳng ai thực 
                    sự ca ngợi một đứa trẻ tốt, nhưng lại lên án khi nó lỡ làm một điều xấu. 
                    Sự hy vọng lại được đặt nơi đứa trẻ xấu có thể hoàn lương, còn sự thất 
                    vọng lại được đặt nơi đứa trẻ tốt vì nghĩ nó chắc chắn sẽ tái phạm. </p>
            </div>
            <div className="flex-3 p-4">
                <h1 className="mb-2 font-bold">ĐỊA CHỈ</h1>
                <ul className="list-disc">
                    <li className="ml-5">Số 4 đường Nguyễn Ái Quốc, Trảng Dài, Đồng Nai</li>
                </ul>
                <h1 className="mb-2 font-bold">SỐ ĐIỆN THOẠI</h1>
                <ul className="list-disc">
                    <li className="ml-5">03322550022</li>
                </ul>
            </div>
            <div className="flex-2 p-4">
                <h1 className="mb-2 font-bold">TỔNG QUÁT</h1>
                <nav className="ml-5">
                    <ul className="list-disc">
                        <li>
                           <Link href="https://ungsinhdongten.net">Test</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex-3 p-4">
                <h1 className="mb-2 font-bold">MEDIA</h1>
            </div>
        </section>
        </>
    )
}