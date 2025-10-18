import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
};

const AboutUsPage = () => {
  return (
    <div className="w-screen flex flex-col mb-20 items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Về EduTest
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <a href={"#"}>Về EduTest</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1050px] pt-10 flex flex-col gap-4 text-justify">
        <div className="font-bold text-xl">
          <p>
            Thi Tiếng Anh Trực Tuyến – EduTest: Nền Tảng Rèn Luyện và Phát Triển
            Kỹ Năng Tiếng Anh{" "}
          </p>
          <p>Hấp dẫn – Lôi cuốn – Đạt kết quả ngay</p>
        </div>

        <ul>
          <li>
            • <span className="font-bold">Hấp dẫn</span> – Các bài học và câu
            hỏi được thiết kế sinh động với hình ảnh hoạt hình bắt mắt, giúp học
            sinh tiếp cận kiến thức một cách thú vị.
          </li>
          <li>
            • <span className="font-bold">Lôi cuốn</span> – Khơi dậy niềm yêu
            thích tiếng Anh, tạo động lực để học sinh chủ động rèn luyện và sử
            dụng ngôn ngữ một cách tự tin.
          </li>
          <li>
            • <span className="font-bold">Đạt kết quả ngay</span> – Hệ thống hỗ
            trợ học sinh nhận biết điểm mạnh và những phần cần cải thiện ngay
            sau mỗi bài kiểm tra, giúp các em nhanh chóng tiến bộ.
          </li>
        </ul>
        <p className="font-bold text-xl">
          Hành Trình Phát Triển Cùng Giáo Dục Việt Nam
        </p>
        <p>
          Thi Tiếng Anh Trực Tuyến – EduTest chính thức ra mắt từ năm học
          2024-2025, được triển khai dưới sự chỉ đạo của Công ty EduTest. Nền
          tảng này cung cấp một môi trường học tập và thi trực tuyến, hỗ trợ học
          sinh trên toàn quốc nâng cao kỹ năng tiếng Anh.
        </p>
        <p>
          Từ năm học 2024-2025, EduTest trở thành một sân chơi tự nguyện, vừa
          giúp học sinh rèn luyện ngoại ngữ, vừa đóng vai trò là công cụ đánh
          giá năng lực tiếng Anh của các em. Tính đến nay, cuộc thi đã thu hút
          hàng triệu học sinh từ 63 tỉnh thành tham gia, trở thành một trong
          những hoạt động giáo dục ngoại ngữ quy mô nhất cả nước.
        </p>
        <div>
          <p className="font-bold text-xl">Tầm Nhìn</p>
          <p className="font-bold">
            &quot;Cuộc thi Olympic Tiếng Anh Trực Tuyến hàng đầu Việt Nam&quot;
          </p>
        </div>
        <p>
          EduTest không chỉ đơn thuần là một cuộc thi, mà còn là một chương
          trình hỗ trợ phát triển phong trào học tiếng Anh trên toàn quốc. Nền
          tảng mang đến cơ hội học tập bình đẳng, giúp học sinh ở mọi vùng miền
          tiếp cận kiến thức một cách dễ dàng, không phân biệt điều kiện kinh tế
          hay nơi sinh sống.
        </p>
        <p>
          Với mục tiêu giúp học sinh nâng cao kỹ năng ngoại ngữ để tự tin hội
          nhập quốc tế, EduTest không ngừng đổi mới, cải tiến nội dung và công
          nghệ nhằm đáp ứng nhu cầu học tập ngày càng đa dạng của học sinh Việt
          Nam. Nhờ đó, nền tảng tiếp tục khẳng định vị thế là cuộc thi tiếng Anh
          trực tuyến lớn nhất dành cho học sinh phổ thông tại Việt Nam.
        </p>
        <p className="font-bold text-xl">Các Tính Năng Nổi Bật Trên EduTest</p>
        <p className="font-bold text-lg">📌 Hệ thống cuộc thi EduTest</p>
        <p className="pl-6">
          Nội dung thi được xây dựng từ nghiên cứu của các chuyên gia giáo dục
          nhằm giúp học sinh củng cố kiến thức hiệu quả qua các vòng tự luyện,
          vòng thi chính thức, vòng thi trải nghiệm và thi thử.
        </p>
        <p className="font-bold text-lg">📌 Chương trình Học Cùng EduTest</p>
        <p className="pl-6">
          Ngoài các kỳ thi, EduTest còn cung cấp chương trình ôn luyện toàn diện
          từ lớp 3 đến lớp 9
        </p>
        <p className="mt-5">
          Với các tính năng học tập đa dạng, EduTest mong muốn trở thành người
          bạn đồng hành đáng tin cậy, giúp học sinh không chỉ cải thiện kỹ năng
          tiếng Anh mà còn phát triển tư duy ngôn ngữ vững chắc. Chúng tôi tin
          rằng, thông qua nền tảng này, các em sẽ có hành trình học tập thú vị,
          đạt được kết quả xuất sắc và tự tin vươn xa trong môi trường hội nhập
          quốc tế. 🌍✨
        </p>
        <p className="font-bold text-lg mt-5">Liên hệ</p>
        <p>
          Mọi thông tin liên quan quý vị và các em học sinh liên hệ BTC qua các
          kênh hỗ trợ sau:
        </p>
        <p>Web hỗ trợ: <a className="text-blue-700 underline" href="http://localhost:3000/support">EduTest</a></p>
        <div>Tổng đài: <span className="font-bold">0123.456.789</span>  (hoạt động: 08h30-21h00 T2-T6)</div>
      </div>
    </div>
  );
};

export default AboutUsPage;
