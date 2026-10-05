import { configureAuth } from "react-query-auth";

import { login, register } from "@/services/auth";
import { logOut } from "@/shared/api/logout";
import { getUser } from "@/shared/api/userProfile";

import type { RegisterDTO } from "@/modules/auth/types";
import type { LoginDTO } from "@/shared/types";

async function registerFn(data: RegisterDTO) {
  const response = await register(data);
  return response;
}

async function userFn() {
  const response = await getUser();
  return response;
}

async function loginFn(data: LoginDTO) {
  const response = await login(data);
  return response;
}

async function logoutFn(data: unknown) {
  const response = await logOut(data as string);
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authConfig: any = {
  userFn,
  loginFn,
  registerFn,
  logoutFn,
};

export const { useUser, useLogin, useRegister, useLogout } = configureAuth(authConfig);
