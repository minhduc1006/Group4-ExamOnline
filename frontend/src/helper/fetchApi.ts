import { User } from "@/types/type";
import { GET_MANAGER, GET_USER_PAGE } from "./urlPath";
import { API } from "./axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getUser(
  page: number,
  pageSize: number,
  username: string,
  email: string,
  accountType: string,
  sort: string
) {
  const res = await API.get(apiURL + GET_USER_PAGE, {
    headers: { "Content-Type": "application/json" },
    params: {
      page: page,
      pageSize: pageSize,
      username: username,
      email: email,
      accountType: accountType,
      sort: sort,
    },
  });
  const data = await res.data;
  return data;
}

export async function getManager(params: string) {
  const res = await API.get(apiURL + GET_MANAGER, {
    headers: { "Content-Type": "application/json" },
    params: { type: params.toUpperCase() },
  });
  const data = await res.data;
  return data as User[];
}
