import Image from "next/image";

const UpdateProfileContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">
        Hướng dẫn đổi thông tin cá nhân
      </div>
      <div>
        Để chỉnh sửa thông tin cá nhân của bạn, vui lòng làm theo các bước sau:
        <div>
          <span className="font-bold">Bước 1: </span> Trên trang chủ của
          EduTest, bạn click vào <span className="font-bold"> Tài khoản </span>{" "}
          như ở hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic6.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 2: </span> Trên trang hồ sơ của bạn,
          bạn click vào <span className="font-bold"> Sửa thông tin </span> như ở
          hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic7.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 3: </span> Trên trang cập nhật sẽ
          hiển thị thông tin của bạn trên các ô, bạn chỉnh sửa thông tin cá nhân
          rồi click vào <span className="font-bold"> Cập nhật </span> như ở hình
          dưới đây là xong:
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic4.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
    </div>
  );
};

export default UpdateProfileContent;
