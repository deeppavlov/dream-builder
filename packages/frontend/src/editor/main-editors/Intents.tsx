import React, { useState, useRef, useEffect } from "react";
import { styled } from "goober";
import { AiOutlinePlus } from "react-icons/ai";

import {
  useCreateResourceMutation,
  useGetResourcesWithTypeQuery,
  useUpdateResourceMutation,
  useStartTaskMutation,
  useGetTaskStateQuery,
  useTestModelQuery
} from "../resourcesSlice";
import type { IntentResource } from "@dp-builder/api_types_ts"

const Editable: React.FC<{
  defaultValue?: string;
  onChange: (newVal: string) => void;
  children: (value: string) => JSX.Element
}> = ({ onChange, defaultValue, children: renderChild }) => {
  const [beingEdited, setBeignEdited] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(defaultValue || "")
  }, [defaultValue])

  useEffect(() => {
    if (beingEdited) inputRef.current?.focus();
  }, [beingEdited]);

  return (
    beingEdited
      ? <EditableInput
        ref={inputRef}
        defaultValue={value}
        onChange={(ev) => setValue(ev.target.value)}
        onBlur={() => (setBeignEdited(false), onChange(value))}
        onKeyDown={ev => ev.key === 'Enter' && (setBeignEdited(false), onChange(value))}
      />
      : React.cloneElement(renderChild(value), { onDoubleClick: () => setBeignEdited(true) })
  )
}

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
        <IntentEntryDiv
          selected={selected}
          onClick={onSelected}
        >
          <IntentName selected={selected}>{val}</IntentName>
          <IntentDetail>{examples.join(', ')}</IntentDetail>
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
}> = ({ selected, onSelected, onChange, children }) => {

  return (
    <Editable onChange={onChange} defaultValue={children}>
      {(val) => (
        <IntentEntryDiv
          selected={selected}
          onClick={onSelected}
        >
          {val.split(" ").map((w, idx) =>
            w.startsWith("$") ? <VarName key={idx}>{w.slice(1)}</VarName> : " " + w
          )}
        </IntentEntryDiv>
      )}
    </Editable>
  );
};

export default () => {
  const { data: intents } = useGetResourcesWithTypeQuery("intent") as { data?: IntentResource[] };
  const [createRes] = useCreateResourceMutation();
  const [updateRes] = useUpdateResourceMutation();
  const [startTask, { data: taskId }] = useStartTaskMutation();
  const { data: trainState = "none" } = useGetTaskStateQuery(taskId || "", { skip: !taskId, pollingInterval: 1000 })

  const [testQuery, setTestQuery] = useState("");
  const { data: testRes, isFetching: loadingTestRes } = useTestModelQuery({ target: "intent", param: testQuery }, { skip: trainState !== "done" })

  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);
  const selectedIntent: IntentResource | null = selectedIntentId && intents ? intents.find(({ resid }) => resid === selectedIntentId) as IntentResource || null : null
  const [hasChanged, setChanged] = useState(false);
  const canTrain = (intents && intents.length > 0 && trainState === 'none') || (trainState !== 'none' && hasChanged)

  const handleOnNewIntent = () => (createRes({
    type: "intent",
    content: { name: "New Intent", examples: [] },
  }), setChanged(true))

  const handleIntentRename = (int: IntentResource) => (newName: string) => updateRes({
    ...int,
    content: {
      ...int.content,
      name: newName
    }
  });

  const handleAddPhrase = (int: IntentResource) => (ev: React.KeyboardEvent<HTMLInputElement>) =>
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
      (ev.target as HTMLInputElement).value = "",
      setChanged(true)
    )

  const handlePharseEdit = (int: IntentResource, phraseIdx: number) => (newVal: string) => (updateRes({
    ...int,
    content: {
      ...int.content,
      examples: [
        ...int.content.examples.slice(0, phraseIdx),
        newVal,
        ...int.content.examples.slice(phraseIdx + 1),
      ]
    }
  }), setChanged(true))

  const handleTrain = () => {
    if (!intents) return
    setChanged(false)
    startTask({ type: "train", target: "intent", inputs: intents.map(({ resid }) => resid) })
  }

  const handleTest = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setTestQuery(value)
  }

  useEffect(() => {
    if (!selectedIntent && intents && intents.length > 0)
      setSelectedIntentId(intents[0].resid);
  }, [intents, selectedIntent]);

  // useEffect(() => {
  //   if (testRes) {
  //     console.log("testRes", testRes)
  //   }
  // }, [testRes])

  return (
    intents
      ? <ColumnsContainer>
        <Column maxwidth="400px">
          <ColumnHeader>
            <ColumnTitle>common intents</ColumnTitle>
            <PlusBtn onClick={handleOnNewIntent} />
          </ColumnHeader>

          {intents.map((intent) => (
            <IntentEntry
              key={intent.resid}
              intentName={intent.content.name}
              examples={intent.content.examples}
              selected={intent.resid === selectedIntent?.resid}
              onSelected={() => setSelectedIntentId(intent.resid)}
              onChange={handleIntentRename(intent)}
            />
          ))}

        </Column>

        <Column>
          <ColumnHeader>
            <ColumnTitle>phrases</ColumnTitle>
          </ColumnHeader>
          <RowContainer>
            <Row>
              {intents.length === 0
                ? <CenterMessage>
                  You don't have any intents! Create one on the left
                </CenterMessage>
                : selectedIntent !== null
                  ? <IntentView>
                    {selectedIntent.content.examples.map((phrase, idx) => (
                      <PhraseEntry
                        key={idx}
                        selected={false}
                        onChange={handlePharseEdit(selectedIntent, idx)}
                      >
                        {phrase}
                      </PhraseEntry>
                    ))}

                    {selectedIntent !== null && intents.length > 0 &&
                      <input
                        type="text"
                        placeholder="Type in a new phrase (enter to create)..."
                        onKeyDown={handleAddPhrase(selectedIntent)}
                      />}
                  </IntentView>
                  : <div />}
            </Row>

            <Row maxheight="300px">
              <ColumnHeader><ColumnTitle>test out your intents</ColumnTitle></ColumnHeader>

              {canTrain
                ? <_CentMsgCont><button onClick={handleTrain}>Click here to train!</button></_CentMsgCont>
                : trainState === "running"
                  ? <_CentMsgCont>Training...</_CentMsgCont>
                  : (
                    <_CentMsgCont>
                      <input type="text" placeholder="Test out your intent here" onChange={handleTest} />
                      <p>{loadingTestRes ? "Initializing..." : testRes && Math.max(...testRes[1][0]) > 0.4 ? `Guessed intent: ${testRes[0]}` : "Unknown intent. Try adding more examples!"}</p>
                    </_CentMsgCont>
                  )
              }
            </Row>
          </RowContainer>
        </Column>
      </ColumnsContainer>

      : <div>Loading...</div>
  );
};

const IntentView = styled("div")({
  padding: "10px"
})

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

const IntentEntryDiv = styled("div")(({
  selected = false,
}: {
  selected?: boolean;
}) => ({
  padding: "5px",
  backgroundColor: selected ? "#DDDDDD" : "unset",
  cursor: "pointer",
}));

const IntentName = styled("div")(({ selected }: { selected: boolean }) => ({
  color: selected ? 'white' : 'black',
  fontWeight: "bold",
  marginBottom: "5px"
}))

const IntentDetail = styled("div")({
  color: "#A8A8A8",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

const EditableInput = styled("input", React.forwardRef)(({ theme }) => ({
  padding: "7px",
  background: "none",
  border: "none",
  outline: theme.logoBg
}))

const VarName = styled("span")(({ theme }) => ({
  backgroundColor: theme.logoBg,
  color: "white",
  borderRadius: "20px",
  marginLeft: "5px",
  padding: "2px",
}));
