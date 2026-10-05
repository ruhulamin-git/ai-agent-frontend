"use client";

import { Lock, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { ChangePassword } from "../change-password/ChangePassword";
import { UserDetails } from "../user-details/UserDetails";

const UserAccount = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 m-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-transparent gap-2 h-auto p-0 mb-6 justify-start">
          <TabsTrigger
            value="account"
            className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20 data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-800/90 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:border-transparent h-auto flex-none gap-2"
          >
            <User className="h-4 w-4" />
            {t("pages.account_settings.account")}
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20 data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-800/90 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:border-transparent h-auto flex-none gap-2"
          >
            <Lock className="h-4 w-4" />
            {t("pages.account_settings.change_password")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="bg-transparent border-gray-300 dark:border-gray-800 rounded">
            <CardContent>
              <UserDetails />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="bg-transparent border-gray-300 dark:border-gray-800 rounded">
            <CardContent>
              <ChangePassword />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { UserAccount };
