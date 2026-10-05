"use client";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import config from "@/modules/ai-builder/config";
import { MENU_OPEN, SET_MENU } from "@/modules/ai-builder/store/actions";

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level, navType, onClick, onUploadFile, isCollapsed }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  const isActive = customization.isOpen.findIndex((id) => id === item.id) > -1;

  const Icon = item.icon;

  const handleFileUpload = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) return;
      onUploadFile(evt.target.result);
    };
    reader.readAsText(file);
  };

  const itemHandler = (id) => {
    if (navType === "SETTINGS" && id !== "loadChatflow") {
      onClick(id);
    } else {
      dispatch({ type: MENU_OPEN, id });
      if (matchesSM) dispatch({ type: SET_MENU, opened: false });
    }
  };

  useEffect(() => {
    if (navType === "MENU") {
      const currentIndex = document.location.pathname
        .toString()
        .split("/")
        .findIndex((id) => id === item.id);
      if (currentIndex > -1) {
        dispatch({ type: MENU_OPEN, id: item.id });
      }
      if (!document.location.pathname.toString().split("/")[1]) {
        itemHandler("chatflows");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navType]);

  const href = item?.external ? item.url : `${config.basename}${item.url}`;
  const target = item.target ? "_blank" : "_self";

  const content = (
    <>
      {item.id === "loadChatflow" && (
        <input type="file" hidden accept=".json" onChange={(e) => handleFileUpload(e)} />
      )}
      <span className={isCollapsed ? "text-lg" : "text-xl flex-shrink-0"}>
        {Icon && <Icon stroke={1.5} size="1.25rem" />}
      </span>
      {!isCollapsed && (
        <span className="text-sm truncate">{item.title}</span>
      )}
      {!isCollapsed && item.isBeta && (
        <span className="ml-auto text-[0.6rem] font-bold bg-teal-500 text-white px-1.5 py-0.5 rounded">
          BETA
        </span>
      )}
    </>
  );

  const className = `w-full flex items-center rounded-lg transition-colors ${
    isActive
      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
  } ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`;

  if (item?.id === "loadChatflow") {
    return (
      <label
        className={`${className} cursor-pointer`}
        title={isCollapsed ? item.title : undefined}
        onClick={() => itemHandler(item.id)}
      >
        {content}
      </label>
    );
  }

  return (
    <Link
      href={href || "#"}
      target={target}
      className={className}
      title={isCollapsed ? item.title : undefined}
      onClick={() => itemHandler(item.id)}
    >
      {content}
    </Link>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  navType: PropTypes.string,
  onClick: PropTypes.func,
  onUploadFile: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

export default NavItem;
