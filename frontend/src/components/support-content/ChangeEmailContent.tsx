import Image from "next/image";

const ChangeEmailContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn sửa email cá nhân</div>
      <div>
        Để chỉnh sửa email cá nhân của bạn, vui lòng làm theo các bước sau:
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
          bạn click vào <span className="font-bold"> Thêm email </span> như ở
          hình dưới đây (<span className="font-bold">Lưu ý: </span>khi tài khoản
          đã có email thì sẽ hiện nút
          <span className="font-bold"> Xóa email </span>, học sinh bấm vào nút
          này để xóa email cá nhân):
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic8.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 3: </span> Hệ thống sẽ gửi cho học
          sinh một email xác nhận vào email cá nhân, làm theo hướng dẫn trong
          email để hoàn tất thêm/xóa email.
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailContent;
