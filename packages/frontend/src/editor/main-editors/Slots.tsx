import React, { useState, useRef, useEffect } from "react";
import { styled } from "goober";
import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Item, useContextMenu } from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

import { useComponent, useData } from "../resourcesSlice";

const MENU_ID = "slot-entry-menu";

const Editable: React.FC<{
  defaultValue?: string;
  defaultEditing?: boolean;
  onChange: (newVal: string) => void;
  children: (value: string) => JSX.Element;
}> = ({
  onChange,
  defaultValue,
  children: renderChild,
  defaultEditing = false,
}) => {
  const [beingEdited, setBeignEdited] = useState(defaultEditing);
  const [value, setValue] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  useEffect(() => {
    if (beingEdited) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [beingEdited, inputRef.current]);

  const handleKeyDown: React.KeyboardEventHandler = (ev) => {
    if (ev.key === "Escape") {
      setBeignEdited(false);
    } else if (ev.key === "Enter" && value !== "") {
      setBeignEdited(false);
      onChange(value);
    }
  };

  return beingEdited ? (
    <EditableInput
      ref={inputRef}
      defaultValue={value}
      onChange={(ev) => setValue(ev.target.value)}
      onBlur={() => (setBeignEdited(false), onChange(value))}
      onKeyDown={handleKeyDown}
    />
  ) : (
    React.cloneElement(renderChild(value), {
      onDoubleClick: () => setBeignEdited(true),
    })
  );
};

const SlotEntry: React.FC<
  {
    slotName: string;
    examples: string[];
    selected: boolean;
    isNew: boolean;
    onSelected?: () => void;
    onNameChange: (newVal: string) => void;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({
  selected,
  onSelected,
  onNameChange,
  slotName,
  examples,
  isNew,
  ...divProps
}) => {
  return (
    <Editable
      onChange={onNameChange}
      defaultValue={slotName}
      defaultEditing={isNew}
    >
      {(val) => (
        <SlotEntryDiv selected={selected} onClick={onSelected} {...divProps}>
          <SlotName selected={selected}>{val}</SlotName>
          <SlotDetail>{examples.join(", ")}</SlotDetail>
        </SlotEntryDiv>
      )}
    </Editable>
  );
};

const ExampleEntry: React.FC<{
  children: string;
  selected: boolean;
  onSelected?: () => void;
  onChange: (newVal: string) => void;
}> = ({ onChange, children }) => {
  return (
    <ExampleEntryDiv>
      <Editable onChange={onChange} defaultValue={children}>
        {(val) => (
          <div style={{ minHeight: "1em" }}>
            {val
              .split(" ")
              .map((w, idx) =>
                w.startsWith("$") ? (
                  <VarName key={idx}>{w.slice(1)}</VarName>
                ) : (
                  " " + w
                )
              )}
          </div>
        )}
      </Editable>
    </ExampleEntryDiv>
  );
};

export default () => {
  const {
    component,
  } = useComponent("gobot");

  const {
    data: slots,
    createData,
    updateData,
    deleteData,
  } = useData(component?.id, "slot");

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [newlyAddedSlotId, setNewlyAddedSlotId] = useState<number | null>(
    null
  );

  const selectedSlot =
    setSelectedSlotId !== null
      ? (slots.find(
          ({ id }) => id === selectedSlotId
        ) as typeof slots[number])
      : null;

  useEffect(() => {
    if (slots && selectedSlotId === null && slots.length > 0)
      setSelectedSlotId(slots[0].id);
  }, [slots, selectedSlotId]);

  const { show: showMenu } = useContextMenu({ id: MENU_ID });

  if (!slots) return <div>Loading...</div>;

  const handleOnNewSlot = () =>
    createData({
      name: "New Slot",
      examples: [],
    }).then((newSlot) => {
      if (newSlot) {
        setSelectedSlotId(newSlot.id);
        setNewlyAddedSlotId(newSlot.id);
      }
    });

  const handleSlotRename =
    (slot: typeof slots[number]) => (newName: string) => {
      updateData(slot.id, { ...slot.content, name: newName.toLowerCase() });
      setNewlyAddedSlotId(null);
    };

  const handleAddExample =
    (slot: typeof slots[number]) =>
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      const target = ev.target as HTMLInputElement;
      if (ev.key === "Enter" && target.value !== "") {
        updateData(slot.id, {
          ...slot.content,
          examples: [...slot.content.examples, target.value],
        });
        target.value = "";
      }
    };

  const handlePharseEdit =
    (slot: typeof slots[number], exampleIdx: number) => (newVal: string) => {
      if (newVal !== "") {
        updateData(slot.id, {
          ...slot.content,
          examples: [
            ...slot.content.examples.slice(0, exampleIdx),
            newVal,
            ...slot.content.examples.slice(exampleIdx + 1),
          ],
        });
      }
    };

  return (
    <>
      <Menu id={MENU_ID} theme="dark" animation={false}>
        <Item onClick={({ props }) => deleteData(props.slotId)}>Delete</Item>
      </Menu>

      <ColumnsContainer>
        <Column maxwidth="400px">
          <ColumnHeader>
            <ColumnTitle>
              gobot slots
            </ColumnTitle>
            <PlusBtn onClick={handleOnNewSlot} />
          </ColumnHeader>

          <SlotEntriesCont>
            {slots
              .concat()
              .sort((a, b) => (a.id < b.id ? -1 : 1))
              .map((slot) => (
                <SlotEntry
                  key={slot.id}
                  isNew={newlyAddedSlotId === slot.id}
                  slotName={slot.content.name}
                  examples={slot.content.examples}
                  selected={slot.id === selectedSlotId}
                  onSelected={() => setSelectedSlotId(slot.id)}
                  onNameChange={handleSlotRename(slot)}
                  onContextMenu={(ev) =>
                    showMenu(ev, { props: { slotId: slot.id } })
                  }
                />
              ))}
          </SlotEntriesCont>
        </Column>

        <Column>
          <ColumnHeader>
            <ColumnTitle>examples</ColumnTitle>
          </ColumnHeader>
          <RowContainer>
            <Row>
              {slots.length === 0 ? (
                <CenterMessage>
                  You don't have any slots! Create one on the left
                </CenterMessage>
              ) : selectedSlot ? (
                <SlotView>
                  {selectedSlot.content.examples.map((example, idx) => (
                    <ExampleEntry
                      key={idx}
                      selected={false}
                      onChange={handlePharseEdit(selectedSlot, idx)}
                    >
                      {example}
                    </ExampleEntry>
                  ))}

                  {selectedSlot !== null && (
                    <ExampleInput
                      type="text"
                      placeholder="Type in a new example (enter to create)..."
                      onKeyDown={handleAddExample(selectedSlot)}
                    />
                  )}
                </SlotView>
              ) : (
                <div />
              )}
            </Row>
          </RowContainer>
        </Column>
      </ColumnsContainer>
    </>
  );
};

const SlotView = styled("div")({
  padding: "10px",
});

const ColumnsContainer = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
});

const Column = styled("div")(
  ({ maxwidth = "unset" }: { maxwidth?: string }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    maxWidth: maxwidth,
    "&:not(:last-child)": {
      borderRight: "#DDDDDD 1px solid",
    },
  })
);

const RowContainer = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
});

const Row = styled("div")(
  ({ maxheight = "unset" }: { maxheight?: string }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    maxHeight: maxheight,
    "&:not(:last-child)": {
      borderBottom: "#DDDDDD 1px solid",
    },
  })
);

const ColumnHeader = styled("div")({
  padding: "10px 10px",
  borderBottom: "1px solid #DDDDDD",
  display: "flex",
  alignItems: "center",
  height: "50px",
});

const ColumnTitle = styled("span")({
  fontVariant: "small-caps",
  color: "gray",
  fontWeight: "bold",
  fontSize: "1.15em",
  flexGrow: 1,
});

const CenterMessage: React.FC = ({ children }) => (
  <_CentMsgCont>
    <p>{children}</p>
  </_CentMsgCont>
);
const _CentMsgCont = styled("div")({
  alignSelf: "stretch",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const PlusBtn = styled(AiOutlinePlus)({
  color: "gray",
  fontSize: "1.8em",
  cursor: "pointer",
});

const SlotEntriesCont = styled("div")({
  padding: "10px",
  overflowY: "auto",
});

const SlotEntryDiv = styled("div")(
  ({ selected = false }: { selected?: boolean }) => ({
    padding: "15px",
    margin: "10px 0",
    backgroundColor: selected ? "#444141" : "unset",
    color: selected ? "white" : "inherit",
    cursor: "pointer",
    borderRadius: "20px",
    "&:hover": {
      backgroundColor: "#e6e5e5",
      color: "white",
    },
  })
);

const SlotName = styled("div")(({ selected }: { selected: boolean }) => ({
  color: selected ? "white" : "black",
  fontWeight: "bold",
  marginBottom: "5px",
}));

const SlotDetail = styled("div")({
  color: "#A8A8A8",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const ExampleEntryDiv = styled("div")({
  padding: "15px",
  cursor: "pointer",
  borderRadius: "25px",
  borderBottomLeftRadius: "0",
  backgroundColor: "#444141",
  color: "white",
  maxWidth: "300px",
  marginBottom: "10px",
});

const EditableInput = styled(
  "input",
  React.forwardRef
)(({ theme }) => ({
  padding: "7px",
  background: "none",
  border: "none",
  outline: theme.logoBg,
  display: "block",
  color: "inherit",
}));

const VarName = styled("span")(({ theme }) => ({
  backgroundColor: theme.logoBg,
  color: "white",
  borderRadius: "20px",
  marginLeft: "5px",
  padding: "2px",
}));

const ExampleInput = styled("input")({
  borderRadius: "15px",
  width: "350px",
  padding: "7px",
  border: "1px solid #DDDDDD",
});

