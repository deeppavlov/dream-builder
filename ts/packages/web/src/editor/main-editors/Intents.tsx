import React, { useState, useRef, useEffect } from "react";
import { styled, css } from "goober";
import { AiOutlinePlus } from "react-icons/ai";

import {
  useCreateResourceMutation,
  useGetResourcesWithTypeQuery,
  useUpdateResourceMutation
} from "../resourcesSlice";
import type { Intent } from "@dp-builder/api-types"

const IntentEntry: React.FC<{
  selected: boolean;
  onSelected?: () => void;
  onChange: (newVal: string) => void;
}> = ({ children, selected, onSelected, onChange }) => {
  const [beingEdited, setBeignEdited] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (beingEdited) divRef.current?.focus();
  }, [beingEdited]);

  return (
    <div
      ref={divRef}
      className={IntentEntryLabelClassName({ selected })}
      contentEditable={beingEdited}
      onClick={onSelected}
      onDoubleClick={() => setBeignEdited(true)}
      onBlur={() => (
        setBeignEdited(false), onChange(divRef.current?.innerText || "")
      )}
      onKeyDown={(e) =>
        e.key === "Enter" &&
        (e.preventDefault(),
          setBeignEdited(false),
          onChange(divRef.current?.innerText || ""))
      }
    >
      {children}
    </div>
  );
};

const renderPhraseName = (name: string) => {
  const words = name.split(" ");
  return words.map((w) =>
    w.startsWith("$") ? <VarName>{w.slice(1)}</VarName> : " " + w
  );
};

export default () => {
  const { data: intents } = useGetResourcesWithTypeQuery("intent");
  const [createRes] = useCreateResourceMutation();
  const [updateRes] = useUpdateResourceMutation();
  console.log('RENDER\n', JSON.stringify(intents, null, 4))

  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);
  const selectedIntent: Intent | null = selectedIntentId && intents ? intents.find(({ resid }) => resid === selectedIntentId) || null : null

  const handleOnNewIntent = () => createRes({
    type: "intent",
    content: { name: "New Intent", examples: [] },
  })

  const handleIntentRename = (int: Intent) => (newName: string) => updateRes({
    ...int,
    content: {
      ...int.content,
      name: newName
    }
  });

  const handleAddPhrase = (int: Intent) => (ev: React.KeyboardEvent<HTMLInputElement>) =>
    ev.key === "Enter" && (ev.target as HTMLInputElement).value !== "" &&
    (
      updateRes({
        ...int,
        content: {
          ...int.content,
          examples: [
            ...int.content.examples,
            (ev.target as HTMLInputElement).value
          ]
        }
      }),
      (ev.target as HTMLInputElement).value = ""
    )

  const handlePharseEdit = (int: Intent, phraseIdx: number) => (newVal: string) => updateRes({
    ...int,
    content: {
      ...int.content,
      examples: [
        ...int.content.examples.slice(0, phraseIdx),
        newVal,
        ...int.content.examples.slice(phraseIdx + 1),
      ]
    }
  })

  useEffect(() => {
    if (!selectedIntent && intents && intents.length > 0)
      setSelectedIntentId(intents[0].resid);
  }, [intents, selectedIntent]);

  return (
    intents
      ? <ColumnsContainer>
        <Column maxwidth="300px">
          <ColumnHeader>
            <ColumnTitle>common intents</ColumnTitle>
            <PlusBtn onClick={handleOnNewIntent} />
          </ColumnHeader>

          {intents.map((intent) => (
            <IntentEntry
              key={intent.resid}
              selected={intent.resid === selectedIntent?.resid}
              onSelected={() => setSelectedIntentId(intent.resid)}
              onChange={handleIntentRename(intent)}
            >
              {intent.content.name}
            </IntentEntry>
          ))}
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
              ) : (
                selectedIntent !== null &&
                selectedIntent.content.examples.map((phrase, idx) => (
                  <IntentEntry
                    key={idx}
                    selected={false}
                    onChange={handlePharseEdit(selectedIntent, idx)}
                  >
                    {renderPhraseName(phrase)}
                  </IntentEntry>
                ))
              )}
              {selectedIntent !== null && intents.length > 0 &&
                <input
                  type="text"
                  placeholder="Type in a new phrase (enter to create)..."
                  onKeyDown={handleAddPhrase(selectedIntent)}
                />
              }
            </Row>
            {selectedIntent !== null && <Row maxheight="400px">
              <ColumnHeader><ColumnTitle>test out your intent</ColumnTitle></ColumnHeader>
              <_CentMsgCont><p>The model hasn't been trained</p> <button>Click here to train!</button></_CentMsgCont>
            </Row>}
          </RowContainer>
        </Column>
      </ColumnsContainer>

      : <div>Loading...</div>
  );
};

const ColumnsContainer = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
});

const Column = styled("div")(
  ({ maxwidth = "unset" }: { maxwidth?: string }) => ({
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
  minHeight: "30px",
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
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  "& > p": {
    margin: 0,
    marginTop: "-25%",
  },
});

const PlusBtn = styled(AiOutlinePlus)({
  color: "gray",
  fontSize: "1.8em",
  cursor: "pointer",
});

const IntentEntryLabelClassName = ({
  selected = false,
}: {
  selected?: boolean;
}) =>
  css({
    padding: "5px",
    backgroundColor: selected ? "#DDDDDD" : "unset",
    cursor: "pointer",
  });

const VarName = styled("span")(({ theme }) => ({
  backgroundColor: theme.logoBg,
  color: "white",
  borderRadius: "20px",
  marginLeft: "5px",
  padding: "2px",
}));
