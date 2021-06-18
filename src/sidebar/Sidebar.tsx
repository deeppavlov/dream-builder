import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useAppDispatch } from "../storeHooks";
import { openPage, useCurrentPage, usePages } from "../editor/pagesSlice";
import logoImg from "./logo.png";
import "./Sidebar.css";
import { getEditorType } from "../editor/main-editors";

const ICON_SIZE = "40px";

export default function () {
  const [isOpen, setOpen] = useState(false);
  const pages = usePages();
  const currentPage = useCurrentPage();
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className={
          "Sidebar-logocont " + (isOpen ? "Sidebar-logocont-open" : "")
        }
        onClick={() => setOpen(!isOpen)}
      >
        <img className="Sidebar-logo" src={logoImg} />
      </div>
      <div className="Sidebar-iconscont">
        {Object.keys(pages)
          .map(getEditorType)
          .map(({ name, Icon }) => (
            <div
              key={name}
              className={
                (name === currentPage[0] ? "Sidebar-icon-sel" : "") +
                (isOpen ? " Sidebar-icon-open" : "")
              }
              onClick={() => dispatch(openPage([name]))}
            >
              <Icon iconSize={ICON_SIZE} />
            </div>
          ))}
      </div>
      <div className={"Sidebar " + (isOpen ? "Sidebar-open" : "")}>
        <div className="Sidebar-header">
          <IoIosArrowBack
            size="60px"
            className="Sidebar-closebtn"
            onClick={() => setOpen(false)}
          />
          <div className="Sidebar-headername">Deepy 3000</div>
        </div>

        {isOpen &&
          Object.keys(pages).map((name) => (
            <div
              key={name}
              className={
                "Sidebar-pagelink " +
                (name === currentPage[0] ? "Sidebar-pagelink-sel" : "")
              }
              onClick={() => dispatch(openPage([name]))}
            >
              {name}
            </div>
          ))}
      </div>
    </>
  );
}
