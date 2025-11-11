import Image from "next/image";

const ChangePasswordContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn đổi mật khẩu</div>
      <div>
        Để chỉnh sửa mật khẩu của bạn, vui lòng làm theo các bước sau:
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
          bạn click vào <span className="font-bold"> Đổi mật khẩu </span> như ở
          hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic9.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 3: </span> Trên cửa sổ sẽ hiện lên
          mẫu đổi mật khẩu, bạn nhập đầy đủ thông tin rồi click vào{" "}
          <span className="font-bold"> Đổi mật khẩu </span> như ở hình dưới đây
          là xong:
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic10.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
    </div>
  );
};

export default ChangePasswordContent;
