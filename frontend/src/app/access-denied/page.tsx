import { IoIosWarning } from "react-icons/io";
const AccessDenied = () => {
  return (
    <div className="bg-[url('/login/bg2.jpg')] bg-cover bg-left bg-no-repeat flex flex-col items-center justify-center h-screen text-black">
      <span className="flex items-center">
        <IoIosWarning className="w-8 h-8 mr-4" />
        <h1 className="text-3xl font-bold">Access Denied!</h1>
      </span>
      <h3>You don&apos;t have permission to see this page</h3>
    </div>
  );
};

export default AccessDenied;
