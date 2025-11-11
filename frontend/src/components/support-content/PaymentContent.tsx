import Image from "next/image";

const PaymentContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn thanh toán mua gói</div>
      <div>
        Để mua gói học - thi, các bạn làm theo các bước sau:
        <div>
          <span className="font-bold">Bước 1: </span> Trên trang chủ của
          EduTest, bạn kéo xuống dưới cùng, chọn gói bạn muốn mua rồi click vào{" "}
          <span className="font-bold"> Mua gói ngay </span> như ở hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/payment/pic1.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 2: </span> Trên trang thanh toán của
          VNPay, bạn click vào phương thức thanh toán mà bạn muốn:
        </div>
      </div>
      <div>
        <Image
          src="/support/payment/pic2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 3: </span> Sau khi lựa chọn phương
          thức thanh toán, trên cửa sổ sẽ hiện lên mẫu thông tin thẻ, bạn nhập
          đầy đủ thông tin rồi click vào{" "}
          <span className="font-bold"> Tiếp tục </span> như ở hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/payment/pic3.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 4: </span> Sau khi điền thông tin
          thanh toán, bạn điền mã Otp được gửi vào số điện thoại đăng ký ngân
          hàng vào rồi bấm nút <span className="font-bold"> Thanh toán </span>{" "}
          như ở hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/payment/pic4.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          <span className="font-bold">Bước 4: </span> Sau khi thanh toán thành
          công, bạn sẽ được chuyển về màn hình như ở hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/payment/pic5.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
    </div>
  );
};

export default PaymentContent;
