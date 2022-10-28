import React, { useContext, useEffect, useState, useRef } from "react";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
const MENU_ID = "intent-entry-menu";

type MenuCallback<T> = (data: T) => void;

interface MenuCallbacks<T> {
  onDelete: MenuCallback<T>;
  onRename: MenuCallback<T>;
}

type MenuSubscribers<T> = {
  [cb in keyof MenuCallbacks<T>]: MenuCallbacks<T>[cb][];
};

interface MenuContext<T> {
  addSub: (name: string, cb: (arg0: T) => void) => void;
  removeSub: (name: string, cb: (arg0: T) => void) => void;
}

interface Menu<T> {
  show: (ev: React.MouseEvent, data: T) => void;
}

const defaultSubscribers = <T extends any>(): MenuSubscribers<T> => ({
  onDelete: [],
  onRename: [],
});

const MenuContext = React.createContext<MenuContext<any>>({
  addSub: () => {},
  removeSub: () => {},
});

export function useMenu<T>(callbacks: MenuCallbacks<T>): Menu<T> {
  const { show } = useContextMenu({ id: MENU_ID });
  const { addSub, removeSub } = useContext(MenuContext);

  useEffect(() => {
    Object.entries(callbacks).forEach(([cbName, cb]) => addSub(cbName, cb));

    return () =>
      Object.entries(callbacks).forEach(([cbName, cb]) =>
        removeSub(cbName, cb)
      );
  }, [callbacks]);

  return {
    show(ev, data) {
      show(ev, { props: { data } });
    },
  };
}

export function MenuProvider({ children }: React.PropsWithChildren<{}>) {
  const [subscribers, setSubscribers] = useState(defaultSubscribers());
  const handleClick =
    (cbName: string) =>
    ({ props: { data } = { data: undefined } }) => {
      console.log("calling callbacks", subscribers);
      if (cbName in subscribers) {
        subscribers[cbName as keyof MenuSubscribers<any>].forEach(
          (cb: MenuCallbacks<any>[keyof MenuCallbacks<any>]) => cb(data)
        );
      }
    };

  const ctx = useRef<MenuContext<any>>({
    addSub(cbName, cb) {
      setSubscribers((subs) => ({
        ...subs,
        [cbName]: [...subs[cbName as keyof MenuSubscribers<any>], cb],
      }));
    },
    removeSub(cbName, cb) {
      setSubscribers((subs) => ({
        ...subs,
        [cbName]: subs[cbName as keyof MenuSubscribers<any>].filter(
          (f) => f !== cb
        ),
      }));
    },
  }).current;

  return (
    <MenuContext.Provider value={ctx}>
      <Menu id={MENU_ID} theme="dark" animation={false}>
        {/* <Item onClick={handleClick("onRename")}>Rename</Item> */}
        <Item onClick={handleClick("onDelete")}>Delete</Item>
      </Menu>
      {children}
    </MenuContext.Provider>
  );
}
