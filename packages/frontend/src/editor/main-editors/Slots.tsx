import React, { useState, useRef, useEffect } from "react";
import { styled } from "goober";
import { AiOutlinePlus } from "react-icons/ai";

import {
  useGetComponentDataWithTypeQuery,
  useCreateComponentMutation,
  useGetComponentsWithTypeQuery,
  useCreateDataMutation,
  useUpdateDataMutation,
  usePostTrainingMutation,
  useGetTrainingQuery,
  useInteractMutation,
} from "../resourcesSlice";
import type { Slot } from "@dp-builder/api_types_ts";

const Editable: React.FC<{
  defaultValue?: string;
  onChange: (newVal: string) => void;
  children: (value: string) => JSX.Element;
}> = ({ onChange, defaultValue, children: renderChild }) => {
  const [beingEdited, setBeignEdited] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  useEffect(() => {
    if (beingEdited) inputRef.current?.focus();
  }, [beingEdited]);

  return beingEdited ? (
    <EditableInput
      ref={inputRef}
      defaultValue={value}
      onChange={(ev) => setValue(ev.target.value)}
      onBlur={() => (setBeignEdited(false), onChange(value))}
      onKeyDown={(ev) =>
        ev.key === "Enter" && value !== "" && (setBeignEdited(false), onChange(value))
      }
    />
  ) : (
    React.cloneElement(renderChild(value), {
      onDoubleClick: () => setBeignEdited(true),
    })
  );
};

const IntentEntry: React.FC<{
  intentName: string;
  examples: string[];
  selected: boolean;
  onSelected?: () => void;
  onChange: (newVal: string) => void;
}> = ({ selected, onSelected, onChange, intentName, examples }) => {
  return (
    <Editable onChange={onChange} defaultValue={intentName}>
      {(val) => (
        <IntentEntryDiv selected={selected} onClick={onSelected}>
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
          <div style={{minHeight:"1em"}}>
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

export default ({ componentType = "gobot" }) => {
  const { data: icComps } = useGetComponentsWithTypeQuery(componentType);
  const [createComp] = useCreateComponentMutation();
  useEffect(() => {
    if (icComps && Object.keys(icComps).length === 0)
      createComp({ type: componentType });
  }, [icComps, createComp]);
  const compId =
    icComps && Object.keys(icComps).length > 0 ? Object.keys(icComps)[0] : null;

  const { data: intents } = useGetComponentDataWithTypeQuery(
    { compId: compId || "", dataType: "slot" },
    { skip: !compId }
  );
  const intentIds = intents ? Object.keys(intents) : [];
  const [createData] = useCreateDataMutation();
  const [updateData] = useUpdateDataMutation();

  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);
  const selectedIntent: Slot | null =
    selectedIntentId && intents
      ? (intents[selectedIntentId] as Slot) || null
      : null;

  // const { data: trainStatus, error: trainError } = useGetTrainingQuery(
  //   { compId: compId || "" },
  //   { skip: !compId, pollingInterval: 3000 }
  // );
  // const [startTrain] = usePostTrainingMutation();
  // const canTrain =
  //   compId &&
  //   intents &&
  //   (!trainStatus || trainError || trainStatus.status === "failed");
  // const [sendMsg, { data: _testRes, isLoading: isFetchingTestRes }] =
  //   useInteractMutation();
  // const testRes = _testRes as unknown as [[string], [number[]]];

  useEffect(() => {
    if (!selectedIntent && intentIds.length > 0)
      setSelectedIntentId(intentIds[0]);
  }, [intents, selectedIntent]);

  if (!compId || !intents) return <div>Loading</div>;

  const handleOnNewIntent = () =>
    createData({
      compId,
      dataType: "slot",
      data: { name: "New Slot", examples: [] },
    });

  const handleIntentRename =
    (intId: string, int: Slot) => (newName: string) =>
      updateData({
        compId,
        dataType: "slot",
        dataId: intId,
        newData: { ...int, name: newName },
      });

  const handleAddPhrase =
    (intId: string, int: Slot) =>
    (ev: React.KeyboardEvent<HTMLInputElement>) =>
      ev.key === "Enter" &&
      (ev.target as HTMLInputElement).value !== "" &&
      (updateData({
        compId,
        dataType: "slot",
        dataId: intId,
        newData: {
          ...int,
          examples: [...int.examples, (ev.target as HTMLInputElement).value],
        },
      }),
      ((ev.target as HTMLInputElement).value = ""));

  const handlePharseEdit =
    (intId: string, int: Slot, phraseIdx: number) => (newVal: string) =>
      updateData({
        compId,
        dataType: "slot",
        dataId: intId,
        newData: {
          ...int,
          examples: [
            ...int.examples.slice(0, phraseIdx),
            newVal,
            ...int.examples.slice(phraseIdx + 1),
          ],
        },
      });

  // const handleTrain = () => startTrain({ compId });
  // const handleTest = (testMsg: string) => sendMsg({ compId, msg: [testMsg] });

  return (
    <ColumnsContainer>
      <Column maxwidth="400px">
        <ColumnHeader>
          <ColumnTitle>
            {componentType.replaceAll("_", " ")} slots
          </ColumnTitle>
          <PlusBtn onClick={handleOnNewIntent} />
        </ColumnHeader>

        <IntentEntriesCont>
          {Object.entries(intents)
            .sort(([_, a], [__, b]) => (a.name < b.name ? -1 : 1))
            .map(([resid, int]) => (
              <IntentEntry
                key={resid}
                intentName={int.name}
                examples={int.examples}
                selected={resid === selectedIntentId}
                onSelected={() => setSelectedIntentId(resid)}
                onChange={handleIntentRename(resid, int as Slot)}
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
            {intentIds.length === 0 ? (
              <CenterMessage>
                You don't have any slots! Create one on the left
              </CenterMessage>
            ) : selectedIntent !== null ? (
              <IntentView>
                {selectedIntent.examples.map((phrase, idx) => (
                  <PhraseEntry
                    key={idx}
                    selected={false}
                    onChange={handlePharseEdit(
                      selectedIntentId as string,
                      selectedIntent,
                      idx
                    )}
                  >
                    {phrase}
                  </PhraseEntry>
                ))}

                {selectedIntent !== null && (
                  <PhraseInput
                    type="text"
                    placeholder="Type in a new phrase (enter to create)..."
                    onKeyDown={handleAddPhrase(
                      selectedIntentId as string,
                      selectedIntent
                    )}
                  />
                )}
              </IntentView>
            ) : (
              <div />
            )}
          </Row>

        </RowContainer>
      </Column>

    </ColumnsContainer>
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
});

const IntentEntryDiv = styled("div")(
  ({ selected = false }: { selected?: boolean }) => ({
    padding: "15px",
    backgroundColor: selected ? "#444141" : "unset",
    color: selected ? "white" : "inherit",
    cursor: "pointer",
    borderRadius: "20px",
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
  color: "inherit"
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
  border: "1px solid #DDDDDD"
})
