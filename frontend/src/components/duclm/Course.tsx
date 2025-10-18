import React from "react";

const Course: React.FC = () => {
  const courseData = [
    {
      title: "FREE COURSE",
      price: "Miễn Phí",
      details: [
        "Tham gia 5 vòng thi đầu tiên",
        "Truy cập một phần kỳ thi",
      ],
      link: "#",
    },
    {
      title: "FULL COURSE",
      price: "99.000 đ/năm",
      details: [
        "Truy cập vào toàn bộ kỳ thi",
        "Thi thử 3 lần",
        "Ôn luyện và đánh giá hiệu quả toàn diện",
      ],
      link: "#",
    },
    {
      title: "COMBO COURSE",
      price: "199.000 đ/năm",
      details: [
        "Truy cập toàn bộ kỳ thi không giới hạn",
        "Thi thử không giới hạn số lần",
        "Tối ưu hóa lộ trình học tập và thi",
      ],
      link: "#",
    },
  ];

  return (
    <div className="w-full py-8 bg-[#F5BA3A]">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-center font-bold text-2xl mb-8 text-white">CÁC KHÓA HỌC EDUTEST</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {courseData.map((course, index) => (
            <div
              key={index}
              className="bg-black bg-opacity-60 p-6 rounded-lg shadow-md w-full h-full flex flex-col justify-between backdrop-blur-lg"
            >
              {/* Title Row */}
              <div className="flex justify-center mb-2">
                <h2 className="text-xl font-bold text-center text-white">{course.title}</h2>
              </div>

              {/* Price Row */}
              <div className="flex justify-center mb-4">
                <p className="text-lg text-center text-white">{course.price}</p>
              </div>

              {/* Details Row */}
              <div className="flex-1">
                <ul className="text-sm text-gray-300">
                  {course.details.map((detail, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button Row */}
              <div className="flex justify-center">
                <a
                  href={course.link}
                  className="w-full mt-4 py-2 bg-white text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-all duration-300 text-center"
                >
                  MUA GÓI NGAY
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Course;
