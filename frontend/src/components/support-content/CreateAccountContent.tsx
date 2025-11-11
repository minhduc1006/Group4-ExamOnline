import Image from "next/image";

const CreateAccountContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn tạo tài khoản</div>
      <div>
        Để tham gia cuộc thi Tiếng Anh trên English Test, các bạn cần đăng ký tài
        khoản học sinh theo hướng dẫn như sau:
        <div>
          <span className="font-bold">Bước 1: </span> Trên trang chủ của
          English Test, bạn click vào <span className="font-bold"> Đăng ký </span>{" "}
          như ở hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/account/pic1.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 2: </span>Màn hình sẽ chuyển về trang
        đăng ký của English Test như bên dưới, học sinh điền đầy đủ thông tin tài
        khoản như hệ thống yêu cầu:
      </div>
      <div>
        <Image
          src="/support/account/pic2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Điền
          <span className="font-bold">
            {" "}
            Tên tài khoản (còn gọi là tên đăng nhập){" "}
          </span>
          là một dãy ít nhất 2 ký tự. Bạn hãy chọn theo ý bạn tuy nhiên không
          được trùng với bất cứ tên đăng nhập nào trong hệ thống. Nếu hệ thống
          báo Tên tài khoản đã tồn tại thì bạn cần chọn lại.
        </div>
        <div>
          {" "}
          <span className="font-bold"> Đặc biệt lưu ý: </span>
          nhiều bạn nhầm Tên tài khoản (Tên đăng nhập) là Họ và Tên của mình bao
          gồm cả khoảng trắng.
        </div>
        <div>
          2 -<span className="font-bold"> Mật khẩu: </span>Bạn nhập mật khẩu
          theo ý bạn.
        </div>
        <div>
          3 -<span className="font-bold"> Xác thực mật khẩu: </span>Bạn gõ lại
          chính xác những ký tự bạn đã gõ ở ô Mật khẩu.
        </div>
        <div>
          4 - Click vào ô “<span className="font-bold"> Đăng ký </span>”
        </div>
      </div>
      <div>
        <span className="font-bold">Bước 3: </span>Sau khi bạn tạo tài khoản
        thành công, bạn cần đăng nhập lại để truy cập tài khoản, điền đầy đủ
        thông tin rồi đăng nhập như ảnh bên dưới:
      </div>
      <div>
        <Image
          src="/support/account/pic3.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 4: </span>Sau khi bạn đăng nhập thành
        công, bạn cần cập nhật thông tin cá nhân để sử dụng dịch vụ, điền đầy đủ
        thông tin hệ thống yêu cầu như ảnh bên dưới:
      </div>
      <div>
        <Image
          src="/support/account/pic4.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Điền
          <span className="font-bold"> Tên của bạn </span>
          là một dãy ít nhất 2 từ, không chứa chữ số hay ký tự đặc biệt.
        </div>
        <div>
          2 -<span className="font-bold"> Các ô nhập khác: </span>Bạn nhập đầy
          đủ thông tin của bạn, các ô không được để trống.
        </div>
      </div>
      <div>
        <span className="font-bold">Bước 5: </span>Sau khi bạn cập nhật thông
        tin thành công, bạn được chuyển tới trang chủ và có thể sử dụng dịch vụ:
      </div>
      <div>
        <Image
          src="/support/account/pic5.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
    </div>
  );
};

export default CreateAccountContent;
