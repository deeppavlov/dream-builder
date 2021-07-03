import React, { useState, useRef, useEffect } from "react";
import { styled, css } from "goober";
import { AiOutlinePlus } from "react-icons/ai";

import {
  useResourcesWithType,
  createResource,
  useResources,
  updateResource,
} from "../resourcesSlice";
import type { Intent } from "@dp-builder/api-types"
import { useAppDispatch } from "../../storeHooks";

const IntentEntry: React.FC<{
  selected: boolean;
  onSelected: () => void;
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
  const intentIds = useResourcesWithType("intent");
  const intents = useResources() as { [id: string]: Intent };
  const dispatch = useAppDispatch();

  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedIntent && intentIds.length > 0)
      setSelectedIntent(intentIds[0]);
  }, [intents, selectedIntent]);

  return (
    <ColumnsContainer>
      <Column maxwidth="300px">
        <ColumnHeader>
          <ColumnTitle>common intents</ColumnTitle>
          <PlusBtn
            onClick={() =>
              dispatch(
                createResource({
                  type: "intent",
                  content: { name: "New Intent", examples: [] },
                })
              )
            }
          />
        </ColumnHeader>

        {intentIds.map((id) => (
          <IntentEntry
            key={id}
            selected={id === selectedIntent}
            onSelected={() => setSelectedIntent(id)}
            onChange={(newVal) =>
              dispatch(
                updateResource({
                  resId: id,
                  newRes: {
                    type: "intent",
                    content: { ...intents[id].content, name: newVal },
                  },
                })
              )
            }
          >
            {intents[id].content.name}
          </IntentEntry>
        ))}
      </Column>

      <Column>
        <ColumnHeader>
          <ColumnTitle>phrases</ColumnTitle>
        </ColumnHeader>
        <RowContainer>
          <Row>
            {intentIds.length === 0 ? (
              <CenterMessage>
                You don't have any intents! Create one on the left
              </CenterMessage>
            ) : (
              selectedIntent !== null &&
              intents[selectedIntent].content.examples.map((phrase, idx) => (
                <IntentEntry
                  key={idx}
                  selected={false}
                  onSelected={() => setSelectedPhrase(idx)}
                  onChange={(newPhrase) =>
                    dispatch(
                      updateResource({
                        resId: selectedIntent,
                        newRes: {
                          type: "intent",
                          content: {
                            name: intents[selectedIntent].content.name,
                            examples: [
                              ...intents[selectedIntent].content.examples.slice(
                                0,
                                idx
                              ),
                              newPhrase,
                              ...intents[selectedIntent].content.examples.slice(
                                idx + 1
                              ),
                            ],
                          },
                        },
                      })
                    )
                  }
                >
                  {renderPhraseName(phrase)}
                </IntentEntry>
              ))
            )}
            {selectedIntent !== null && intentIds.length > 0 && 
              <input
              type="text"
              placeholder="Type in a new phrase (enter to create)..."
              onKeyDown={(e) =>
                selectedIntent &&
                  //@ts-ignore
                e.key === "Enter" && e.target.value !== "" &&
                (dispatch(
                  updateResource({
                    resId: selectedIntent,
                    newRes: {
                      type: "intent",
                      content: {
                        name: intents[selectedIntent].content.name,
                        examples: [
                          ...intents[selectedIntent].content.examples,
                          //@ts-ignore
                          e.target.value,
                        ],
                      },
                    },
                  })
                ),
                //@ts-ignore
                (e.target.value = ""))
              }
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
