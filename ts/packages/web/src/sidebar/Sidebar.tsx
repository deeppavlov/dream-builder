import React, { useState, useMemo } from "react";
/* import { IoIosArrowBack } from "react-icons/io"; */
import { styled } from "goober";

import { useAppDispatch } from "../storeHooks";
import {
  openPage,
  Page,
  useCurrentPage,
  usePages,
  useEditorTypeFromPath,
} from "../editor/pagesSlice";
import logoImg from "./logo.png";

interface PageItemState {
  $open?: boolean;
  $collapsed?: boolean;
  $selected?: boolean;
  $moving?: boolean;
}

const OPEN_DURATION = "0.2s";
const SLIDE_DURATION = "0.2s";
const SIDEBAR_OPENWIDTH = 500;
const SIDEBAR_CLOSEDWIDTH = 100;

const useSelectedIdx = (pages: Page[], pagePath: string[]) =>
  useMemo(() => {
    const pagePathStr = pagePath.join(".");
    const countIdx = (
      toSearch: Page[],
      relPath: string[] = []
    ): [boolean, number] => {
      let idx = 0;
      for (const page of toSearch) {
        const p = [...relPath, page.name];
        if (p.join(".") === pagePathStr) return [true, idx];
        if (pagePathStr.startsWith(p.join("."))) {
          const [found, newCount] = countIdx(page.subpages, p);
          idx += newCount + 1;
          if (found) return [true, idx];
        } else {
          idx += 1;
        }
      }
      return [false, idx];
    };

    const [found, idx] = countIdx(pages);
    if (!found) throw new Error(pagePath.join("/") + " page not found");
    return idx;
  }, [pages, pagePath]);

const PageItem: React.FC<{
  sidebarOpen: boolean;
  sidebarMoving: boolean;
  page: Page;
  openPagePath: string[];
  parentPath?: string[];
}> = ({
  sidebarOpen,
  sidebarMoving,
  page: { name, subpages },
  openPagePath,
  parentPath = [],
}) => {
  const selfPath = [...parentPath, name];
  const collapsed = openPagePath[0] !== name;
  const selected = !collapsed && openPagePath.length === 1;
  const { Icon } = useEditorTypeFromPath(selfPath) || {};
  const dispatch = useAppDispatch();

  return (
    <PageItemCont>
      <PageItemEntry
        $selected={selected}
        onClick={() => dispatch(openPage(selfPath))}
      >
        <PageItemIcon
          $open={sidebarOpen}
          $selected={selected}
          $moving={sidebarMoving}
        >
          {Icon && <Icon iconSize={"40px"} />}
        </PageItemIcon>
        <PageItemName $open={sidebarOpen} $selected={selected}>
          {name}
        </PageItemName>
      </PageItemEntry>

      <PageItemChildrenCont $collapsed={collapsed}>
        {subpages.length > 0 &&
          subpages.map((page) => (
            <PageItem
              key={page.name}
              page={page}
              parentPath={selfPath}
              sidebarOpen={sidebarOpen}
              sidebarMoving={sidebarMoving}
              openPagePath={openPagePath.slice(1)}
            />
          ))}
      </PageItemChildrenCont>
    </PageItemCont>
  );
};

export default function () {
  const [isOpen, _setIsOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const setOpen = (open: boolean) => {
    _setIsOpen(open);
    setIsMoving(true);
  };

  const pages = usePages();
  const currentPage = useCurrentPage();
  const currentPageIdx = useSelectedIdx(pages, currentPage);
  const currentPageLevel = currentPage.length - 1;

  return (
    <>
      <LogoCont $open={isOpen} onClick={() => setOpen(!isOpen)}>
        <LogoImg src={logoImg} />
      </LogoCont>

      <SidebarBg $open={isOpen} onTransitionEnd={() => setIsMoving(false)} />

      <SidebarCont $open={isOpen}>
        <PageItemSelectedOverlay
          idx={currentPageIdx}
          level={currentPageLevel}
          open={isOpen}
        />

        {pages.map((page) => (
          <PageItem
            key={page.name}
            page={page}
            sidebarOpen={isOpen}
            sidebarMoving={isMoving}
            openPagePath={currentPage}
          />
        ))}
      </SidebarCont>
    </>
  );
}

const SidebarCont = styled("div")<PageItemState>(({ $open: open }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: open ? 0 : `${SIDEBAR_CLOSEDWIDTH - SIDEBAR_OPENWIDTH}px`,

  width: "500px",
  paddingTop: "100px",
  borderTopRightRadius: "45px",
  transition: `left linear ${OPEN_DURATION}`,
}));

const SidebarBg = styled(SidebarCont)(({ theme }) => ({
  zIndex: 1,
  backgroundColor: theme.sidebarBg,
}));

const LogoCont = styled("div")<PageItemState>(({ theme, $open: open }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 4,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100px",
  height: "100px",

  cursor: "pointer",
  backgroundColor: theme.logoBg,
  borderTopRightRadius: "45px",
  borderBottomRightRadius: open ? "45px" : "unset",
  transition: `border-bottom-right-radius linear ${OPEN_DURATION}`,
}));

const LogoImg = styled("img")({
  width: "80px",
  height: "80px",
});

const PageItemCont = styled("div")({
  marginTop: "40px",
});

const PageItemEntry = styled("div")<PageItemState>(
  ({ theme, $selected: selected }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    height: "60px",

    zIndex: 3,
    cursor: selected ? "default" : "pointer",
    userSelect: "none",
    color: selected ? theme.sidebarBg : theme.sidebarPrimary,
    transition: `color linear ${OPEN_DURATION}`,
  })
);

const PageItemIcon = styled("div")<PageItemState>(
  ({ theme, $open: open, $selected: selected, $moving: moving }) => ({
    position: "relative",
    left: open ? 0 : "100%",
    transform: open ? "unset" : "translateX(-100%)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "40px",

    backgroundColor: moving
      ? selected
        ? "transparent"
        : theme.sidebarBg
      : "transparent",
    borderRadius: selected ? "60px" : "unset",
    transition: `left linear ${OPEN_DURATION}, transform linear ${OPEN_DURATION}`,
  })
);

const PageItemName = styled("div")<PageItemState>(
  ({ $open }) => ({
    fontSize: "1.6em",
    opacity: $open ? 1 : 0,
    transition: "opacity linear 0.05s",
    transitionDelay: $open ? "0.15s" : "unset",
  })
);

const PageItemChildrenCont = styled("div")<PageItemState>(({ $collapsed }) => ({
  display: "flex",
  flexDirection: "column",
  paddingLeft: "50px",
  maxHeight: $collapsed ? "0" : "1000px",
  overflow: "hidden",
  transition: "max-height linear 0.2s",
}));

const PageItemSelectedOverlay = styled("div")<{
  idx: number;
  open: boolean;
  level: number;
}>(({ idx, open, level, theme }) => ({
  position: "absolute",
  top: `${idx * 100 + 140}px`,
  left: open ? `${level * 50 + 10}px` : "410px",
  right: "10px",
  zIndex: 2,

  height: "60px",

  backgroundColor: theme.sidebarPrimary,
  borderRadius: "60px",
  transition: `width linear ${OPEN_DURATION}, padding-left linear ${OPEN_DURATION}, top linear ${SLIDE_DURATION}, left linear ${SLIDE_DURATION}`,
}));
