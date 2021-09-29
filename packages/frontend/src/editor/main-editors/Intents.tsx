import React, { useState, useRef, useEffect } from "react";
import { styled } from "goober";
import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Item, useContextMenu } from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

import { useComponent, useData } from "../resourcesSlice";

const MENU_ID = "intent-entry-menu";

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

const IntentEntry: React.FC<
  {
    intentName: string;
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
  intentName,
  examples,
  isNew,
  ...divProps
}) => {
  return (
    <Editable
      onChange={onNameChange}
      defaultValue={intentName}
      defaultEditing={isNew}
    >
      {(val) => (
        <IntentEntryDiv selected={selected} onClick={onSelected} {...divProps}>
          <IntentName selected={selected}>{val}</IntentName>
          <IntentDetail>{examples.join(", ")}</IntentDetail>
        </IntentEntryDiv>
      )}
    </Editable>
  );
};

const PhraseEntry: React.FC<{
  children: string;
  selected: boolean;
  onSelected?: () => void;
  onChange: (newVal: string) => void;
}> = ({ onChange, children }) => {
  return (
    <PhraseEntryDiv>
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
    </PhraseEntryDiv>
  );
};

export default ({ componentType = "intent_catcher" }) => {
  const {
    component,
    canTrain,
    trainingStatus,
    isFetchingTestRes,
    messages,
    interact,
    train,
  } = useComponent(componentType);

  const lastMessage = messages?.slice(-1).pop();
  const lastResponse =
    lastMessage?.user_type === "bot"
      ? (lastMessage.annotations?.intent as [string, number][])
      : undefined;
  const bestIntent = lastResponse?.reduce(
    (best, cur) => (cur[1] > best[1] ? cur : best),
    ["", -1]
  );

  const {
    data: intents,
    createData,
    updateData,
    deleteData,
  } = useData(component?.id, "intent");

  const [selectedIntentId, setSelectedIntentId] = useState<number | null>(null);
  const [newlyAddedIntentId, setNewlyAddedIntentId] = useState<number | null>(
    null
  );

  const selectedIntent =
    setSelectedIntentId !== null
      ? (intents.find(
          ({ id }) => id === selectedIntentId
        ) as typeof intents[number])
      : null;

  useEffect(() => {
    if (intents && selectedIntentId === null && intents.length > 0)
      setSelectedIntentId(intents[0].id);
  }, [intents, selectedIntentId]);

  const { show: showMenu } = useContextMenu({ id: MENU_ID });

  if (!intents) return <div>Loading...</div>;

  const handleOnNewIntent = () =>
    createData({
      name: "New Intent",
      examples: [],
    }).then((newIntent) => {
      if (newIntent) {
        setSelectedIntentId(newIntent.id);
        setNewlyAddedIntentId(newIntent.id);
      }
    });

  const handleIntentRename =
    (int: typeof intents[number]) => (newName: string) => {
      updateData(int.id, { ...int.content, name: newName });
      setNewlyAddedIntentId(null);
    };

  const handleAddPhrase =
    (int: typeof intents[number]) =>
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      const target = ev.target as HTMLInputElement;
      if (ev.key === "Enter" && target.value !== "") {
        updateData(int.id, {
          ...int.content,
          examples: [...int.content.examples, target.value],
        });
        target.value = "";
      }
    };

  const handlePharseEdit =
    (int: typeof intents[number], phraseIdx: number) => (newVal: string) => {
      if (newVal !== "") {
        updateData(int.id, {
          ...int.content,
          examples: [
            ...int.content.examples.slice(0, phraseIdx),
            newVal,
            ...int.content.examples.slice(phraseIdx + 1),
          ],
        });
      }
    };

  const handleTrain = train;
  const handleTest = (testMsg: string) =>
    interact({ user_type: "user", text: testMsg });

  return (
    <>
      <Menu id={MENU_ID} theme="dark" animation={false}>
        <Item onClick={({ props }) => deleteData(props.intId)}>Delete</Item>
      </Menu>

      <ColumnsContainer>
        <Column maxwidth="400px">
          <ColumnHeader>
            <ColumnTitle>
              {componentType.replaceAll("_", " ")} intents
            </ColumnTitle>
            <PlusBtn onClick={handleOnNewIntent} />
          </ColumnHeader>

          <IntentEntriesCont>
            {intents
              .concat()
              .sort((a, b) => (a.id < b.id ? -1 : 1))
              .map((int) => (
                <IntentEntry
                  key={int.id}
                  isNew={newlyAddedIntentId === int.id}
                  intentName={int.content.name}
                  examples={int.content.examples}
                  selected={int.id === selectedIntentId}
                  onSelected={() => setSelectedIntentId(int.id)}
                  onNameChange={handleIntentRename(int)}
                  onContextMenu={(ev) =>
                    showMenu(ev, { props: { intId: int.id } })
                  }
                />
              ))}
          </IntentEntriesCont>
        </Column>

        <Column>
          <ColumnHeader>
            <ColumnTitle>phrases</ColumnTitle>
          </ColumnHeader>
          <RowContainer>
            <Row>
              {intents.length === 0 ? (
                <CenterMessage>
                  You don't have any intents! Create one on the left
                </CenterMessage>
              ) : selectedIntent ? (
                <IntentView>
                  {selectedIntent.content.examples.map((phrase, idx) => (
                    <PhraseEntry
                      key={idx}
                      selected={false}
                      onChange={handlePharseEdit(selectedIntent, idx)}
                    >
                      {phrase}
                    </PhraseEntry>
                  ))}

                  {selectedIntent !== null && (
                    <PhraseInput
                      type="text"
                      placeholder="Type in a new phrase (enter to create)..."
                      onKeyDown={handleAddPhrase(selectedIntent)}
                    />
                  )}
                </IntentView>
              ) : (
                <div />
              )}
            </Row>

            {componentType === "intent" && (
              <Row maxheight="300px">
                <ColumnHeader>
                  <ColumnTitle>test out your intents</ColumnTitle>
                </ColumnHeader>

                {canTrain ? (
                  <_CentMsgCont>
                    <button onClick={handleTrain}>Click here to train!</button>
                  </_CentMsgCont>
                ) : trainingStatus === "RUNNING" ? (
                  <_CentMsgCont>Training...</_CentMsgCont>
                ) : (
                  <_CentMsgCont>
                    <input
                      type="text"
                      placeholder="Test out your intent here"
                      onChange={(ev) => handleTest(ev.target.value)}
                    />
                    <p>
                      {isFetchingTestRes || !lastResponse
                        ? "Initializing..."
                        : messages && bestIntent
                        ? `Guessed intent: ${bestIntent[0]}`
                        : "Unknown intent. Try adding more examples!"}
                    </p>
                  </_CentMsgCont>
                )}
              </Row>
            )}
          </RowContainer>
        </Column>
      </ColumnsContainer>
    </>
  );
};

const IntentView = styled("div")({
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

const IntentEntriesCont = styled("div")({
  padding: "10px",
  overflowY: "auto",
});

const IntentEntryDiv = styled("div")(
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

const IntentName = styled("div")(({ selected }: { selected: boolean }) => ({
  color: selected ? "white" : "black",
  fontWeight: "bold",
  marginBottom: "5px",
}));

const IntentDetail = styled("div")({
  color: "#A8A8A8",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const PhraseEntryDiv = styled("div")({
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

const PhraseInput = styled("input")({
  borderRadius: "15px",
  width: "350px",
  padding: "7px",
  border: "1px solid #DDDDDD",
});
