"use client";
import { useForm } from "react-hook-form";
import { Form, FormField } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfileSchema } from "@/helper/schema";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { UPDATE_PROFILE } from "@/helper/urlPath";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Button, Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import "react-datepicker/dist/react-datepicker.css";
import { normalizeName } from "@/helper/CommonUtils";
import { API } from "@/helper/axios";

type Pair = {
  code: string;
  name: string;
};
const listGrade = [
  [
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ],
  [
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
  ],
];

const UpdateProfileForm = () => {
  const { toast } = useToast();
  const [formError, setFormError] = useState<string>("");
  const router = useRouter();
  const user = useCurrentUser();
  const isNewUser = !user.data?.name;

  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<Pair[]>([]);
  const [districts, setDistricts] = useState<Pair[]>([]);
  const [wards, setWards] = useState<Pair[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [gradeOptions, setGradeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    setFormError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await API.put(
        `${process.env.NEXT_PUBLIC_API_URL}${UPDATE_PROFILE}`,
        {
          id: user.data?.id,
          name: normalizeName(data.name),
          gender: data.gender,
          grade: data.grade,
          province: data.province,
          district: data.district,
          ward: data.ward,
          birthDate: data.birthDate,
          educationLevel: data.educationLevel,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (isNewUser) {
        router.push("/");
      } else {
        router.push("/profile?content=UserInfo");
      }
      toast({
        title: "Cập nhập thành công!",
        className: "text-white bg-green-500",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFormError("Cập nhật thất bại, hãy đăng nhập lại và thử lại!");
    }
  };

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: String(user.data?.name ?? ""),
      gender: String(user.data?.gender ?? ""),
      grade: String(user.data?.grade ?? ""),
      province: String(user.data?.province ?? ""),
      district: String(user.data?.district ?? ""),
      ward: String(user.data?.ward ?? ""),
      birthDate: String(user.data?.birthDate ?? ""),
      educationLevel: String(user.data?.educationLevel ?? ""),
    },
  });

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
        setHasFetched(true);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch tỉnh/thành phố:", error);
      });
  }, []);

  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setWards([]);

    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await res.json();
      setDistricts(data.districts);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu quận huyện:", error);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrict(districtCode);

    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await res.json();
      setWards(data.wards);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phường xã:", error);
    }
  };

  useEffect(() => {
    if (hasFetched && user.data?.province && !districts.length) {
      const province = provinces.find((p) => p.name === user.data?.province);
      if (province) {
        setSelectedProvince(province.code);
        fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => {
            setDistricts(data.districts);
          });
      }
    }
  }, [hasFetched, provinces, user.data?.province, districts]);

  useEffect(() => {
    if (user.data?.district && !wards.length) {
      const district = districts.find((d) => d.name === user.data?.district);
      if (district) {
        setSelectedDistrict(district.code);
        fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => setWards(data.wards));
      }
    }
  }, [districts, user.data?.district, wards]);

  const handleChangeEducationLevel = (level: string) => {
    if (level === "Tiểu học") {
      setGradeOptions(listGrade[0]);
    } else if (level === "Trung học cơ sở") {
      setGradeOptions(listGrade[1]);
    } else {
      setGradeOptions([]);
    }
  };

  useEffect(() => {
    if (user.data?.educationLevel) {
      handleChangeEducationLevel(user.data.educationLevel);
    }
  }, [user.data?.educationLevel]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row w[100%] justify-around">
            <div className="flex flex-col w-[45%] gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  const error = form.formState.errors?.name;
                  return (
                    <div>
                      <label htmlFor="Name" style={{}}>
                        Tên của bạn
                      </label>
                      <Input
                        type="text"
                        placeholder="name"
                        autoComplete="name"
                        defaultValue={field.value}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        isInvalid={!!error?.message}
                        radius="sm"
                        className={`p-2 w-full border ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        {...field}
                      />
                    </div>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => {
                  const error = form.formState.errors?.gender;

                  const options = [
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ];

                  return (
                    <div className="select-form flex flex-col">
                      <label htmlFor="Gender">Giới tính</label>
                      <Select
                        id="gender"
                        selectedKeys={[field.value]}
                        placeholder="gender"
                        onSelectionChange={(keys) =>
                          field.onChange([...keys][0])
                        }
                        isInvalid={!!error?.message}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        className={`p-2 border ${
                          field.value ? "text-black" : "text-gray-400"
                        } ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        popoverProps={{
                          className:
                            "border rounded-lg dark bg-white bg-opacity-55 backdrop-blur-lg",
                        }}
                        aria-label="Chọn giới tính"
                      >
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => {
                  const error = form.formState.errors?.birthDate;

                  return (
                    <div className="select-form flex flex-col">
                      <label htmlFor="BirthDate">Ngày sinh</label>
                      <Input
                        type="date"
                        placeholder="date"
                        autoComplete="date"
                        defaultValue={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : undefined
                        }
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        isInvalid={!!error?.message}
                        radius="sm"
                        className={`p-2 w-full border ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        {...field}
                      />
                    </div>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => {
                  const error = form.formState.errors?.grade;

                  const options = gradeOptions;

                  const selectedValue = options.some(
                    (option) => option.value === field.value
                  )
                    ? field.value
                    : options.length > 0
                    ? options[0].value
                    : "";

                  return (
                    <div className="select-form flex flex-col">
                      <label htmlFor="Grade">Lớp</label>
                      <Select
                        id="grade"
                        selectedKeys={[selectedValue]}
                        placeholder="grade"
                        onSelectionChange={(keys) =>
                          field.onChange([...keys][0])
                        }
                        isInvalid={!!error?.message}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        className={`p-2 border ${
                          field.value ? "text-black" : "text-gray-400"
                        } ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        popoverProps={{
                          className:
                            "border rounded-lg dark bg-white bg-opacity-55 backdrop-blur-lg",
                        }}
                        aria-label="Chọn lớp"
                      >
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  );
                }}
              />
            </div>
            <div className="flex flex-col w-[45%] gap-5">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => {
                  const error = form.formState.errors?.province;

                  return (
                    <div className="select-form flex flex-col">
                      <label htmlFor="Province">Tỉnh/Thành phố</label>
                      <Select
                        id="province"
                        selectedKeys={field.value ? [field.value] : []} // Chỉ chọn nếu có giá trị
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          field.onChange(selectedName); // Lưu name vào field

                          // Tìm code dựa trên name
                          const selectedProvince = provinces.find(
                            (p) => p.name === selectedName
                          );
                          if (selectedProvince) {
                            handleProvinceChange(selectedProvince.code); // Gọi API với code
                          }
                        }}
                        placeholder="province"
                        onSelectionChange={(keys) =>
                          field.onChange([...keys][0])
                        }
                        isInvalid={!!error?.message}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        className={`p-2 w-full border ${
                          field.value ? "text-black" : "text-gray-400"
                        } ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        popoverProps={{
                          className:
                            "border rounded-lg dark bg-white bg-opacity-55 backdrop-blur-lg",
                        }}
                        aria-label="Chọn tỉnh/thành phố"
                      >
                        {provinces.map((province) => (
                          <SelectItem key={province.name} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => {
                  const error = form.formState.errors?.district;

                  const options = districts;

                  const selectedValue = options.some(
                    (option) => option.name === field.value
                  )
                    ? field.value
                    : options.length > 0
                    ? options[0].name
                    : "";

                  return (
                    <div className="select-form flex flex-col">
                      <label htmlFor="District">Quận/Huyện</label>
                      <Select
                        id="district"
                        selectedKeys={[selectedValue]} // Chỉ chọn nếu có giá trị
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          field.onChange(selectedName); // Lưu name vào field

                          // Tìm code dựa trên name
                          const selectedDistrict = districts.find(
                            (d) => d.name === selectedName
                          );
                          if (selectedDistrict) {
                            handleDistrictChange(selectedDistrict.code); // Gọi API với code
                          }
                        }}
                        placeholder="district"
                        onSelectionChange={(keys) =>
                          field.onChange([...keys][0])
                        }
                        isInvalid={!!error?.message}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        className={`p-2 w-full border ${
                          field.value ? "text-black" : "text-gray-400"
                        } ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        popoverProps={{
                          className:
                            "border rounded-lg dark bg-white bg-opacity-55 backdrop-blur-lg",
                        }}
                        aria-label="Chọn quận/huyện"
                      >
                        {options.map((district) => (
                          <SelectItem key={district.name} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => {
                  const error = form.formState.errors?.ward;

                  const options = wards;

                  const selectedValue = options.some(
                    (option) => option.name === field.value
                  )
                    ? field.value
                    : options.length > 0
                    ? options[0].name
                    : "";

                  return (
                    <div className=" select-form flex flex-col">
                      <label htmlFor="Ward">Phường/Xã</label>
                      <Select
                        id="ward"
                        selectedKeys={[selectedValue]} // Chỉ chọn nếu có giá trị
                        placeholder="ward"
                        onSelectionChange={(keys) =>
                          field.onChange([...keys][0])
                        }
                        isInvalid={!!error?.message}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        className={`p-2 w-full border ${
                          field.value ? "text-black" : "text-gray-400"
                        } ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        popoverProps={{
                          className:
                            "border rounded-lg dark bg-white bg-opacity-55 backdrop-blur-lg",
                        }}
                        aria-label="Chọn phường/xã"
                      >
                        {options.map((ward) => (
                          <SelectItem key={ward.name} value={ward.name}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const error: any = form.formState.errors?.educationLevel;

                  const options = [
                    { value: "Tiểu học", label: "Tiểu học" },
                    { value: "Trung học cơ sở", label: "Trung học cơ sở" },
                  ];

                  return (
                    <div className="select-form flex flex-col">
                      <label htmlFor="EducationLevel">Cấp</label>
                      <Select
                        id="educationLevel"
                        selectedKeys={[field.value]}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          field.onChange(selectedName);
                          if (selectedName) {
                            handleChangeEducationLevel(selectedName); // Cập nhật lớp học khi chọn cấp
                          }
                        }}
                        placeholder="educationLevel"
                        onSelectionChange={(keys) =>
                          field.onChange([...keys][0])
                        }
                        isInvalid={!!error?.message}
                        errorMessage={
                          <span className="text-red-500">{error?.message}</span>
                        }
                        className={`p-2 border ${
                          field.value ? "text-black" : "text-gray-400"
                        } ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } rounded-sm`}
                        popoverProps={{
                          className:
                            "border rounded-lg dark bg-white bg-opacity-55 backdrop-blur-lg",
                        }}
                        aria-label="Chọn cấp"
                      >
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div className="my-10 flex justify-center w-full">
            {formError && (
              <p className="text-red-500 mb-2 text-center">{formError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-[30%] mx-[35%] bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
            disabled={form.formState.isSubmitting}
          >
            Cập Nhật
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpdateProfileForm;
