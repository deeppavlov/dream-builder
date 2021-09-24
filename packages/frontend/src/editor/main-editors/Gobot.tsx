import React, { useState, useRef, useEffect, useContext } from "react";
import ReactFlow, { Handle, Controls, Background, updateEdge, addEdge, removeElements, OnLoadParams, Elements, NodeTypesType, Position, BackgroundVariant } from 'react-flow-renderer';
import { styled } from "goober";
import { nanoid } from "nanoid";
// import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import {
  useGetComponentsWithTypeQuery,
  useCreateComponentMutation,
  useCreateDataMutation,
  useGetComponentDataWithTypeQuery,
  useUpdateDataMutation,
  usePostTrainingMutation,
  useGetTrainingQuery,
  useInteractMutation
} from "../resourcesSlice";
// import type { Intent, Resource } from "@dp-builder/api_types_ts"

interface FlowRes {
  el: Elements; 
}

interface NodeData {
  [k: string]: any;
}

const UpdateNodeDataContext = React.createContext((_: string, __: NodeData) => {})
const DeleteNoteCbContext = React.createContext((_: string) => {})
const ActiveComponentIdContext = React.createContext<null | string>(null)

const Dropdown = ({ options, onSelect, selected }: { options: string[], onSelect: (opt: string) => void, selected?: string }) => {
  if (!selected) selected = options[0]

  return (
    <select onChange={(ev) => onSelect(ev.target.value)} value={selected} style={{width: "100%"}}>
      {options.map((opt) => <option key={opt}>{opt}</option>)}
    </select>
  )
}

const withMenu = <P extends React.PropsWithChildren<{ id: string }>>(Comp: React.FC<P>): React.FC<P> => ({ ...props }) => {
  const onDelete = React.useContext(DeleteNoteCbContext) 
  return <div onDoubleClick={() => onDelete(props.id)}><Comp {...props}/></div>
}

const UtteranceNode = withMenu(({ id, data: { selectedIntent } }: { id: string, data: NodeData }) => {
  const onDataChange = useContext(UpdateNodeDataContext)
  const compId = useContext(ActiveComponentIdContext)
  const { data: intentsObj } = useGetComponentDataWithTypeQuery({ compId: compId || "", dataType: "intent" }, { skip: !compId });
  const intents = intentsObj ? Object.values(intentsObj) : []

  return (
    <NodeContainer>
      <NodeTitle>User Utterance</NodeTitle>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />
      <NodeBody>
        {(intents.length > 0 &&
          <Dropdown options={intents.map((int) => int.name)} onSelect={(newOpt) => onDataChange(id, { selectedIntent: newOpt })} selected={selectedIntent}/>
          || "No intents to select, create one"
        )}
      </NodeBody>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />
    </NodeContainer>
  )
})

const ApiCallNode = withMenu(({ id, data }: { id: string, data: NodeData }) => {
  const onDataChange = useContext(UpdateNodeDataContext)
  const onInputChange = (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => onDataChange(id, { ...data, [field]: ev.target.value })

  return (
    <NodeContainer>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />

      <NodeTitle>Api Call</NodeTitle>
      <NodeBody>
        {["endpoint", "method", "payload"].map((n) => <div key={n}><span>{n.charAt(0).toUpperCase() + n.slice(1)}:</span> <input type="text" value={data[n] || ""} onChange={onInputChange(n)} style={{width: "100%"}}/></div>)}
      </NodeBody>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ top: '50%', borderRadius: 0 }}
      />
    </NodeContainer>
  )
})

const ResponseNode = withMenu(({ id, data: { respStr } }: { id: string, data: NodeData }) => {
  const onDataChange = useContext(UpdateNodeDataContext)
  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => (onDataChange(id, { respStr: ev.target.value }), console.log('input', ev.target.value))

  return (
    <NodeContainer>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />

      <NodeTitle>Response</NodeTitle>
      <NodeBody>
        <input type="text" value={respStr || ""} onChange={onInputChange} style={{width: "100%"}}/>
      </NodeBody>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ top: '50%', borderRadius: 0 }}
      />
    </NodeContainer>
  )
})

const nodeTypes: NodeTypesType = {
  utterance: UtteranceNode,
  apicall: ApiCallNode,
  response: ResponseNode
}

const Palette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <PaletteContainer>
      {Object.keys(nodeTypes).map((type) => (
        <DndNode key={type} onDragStart={(event) => onDragStart(event, type)} draggable>
          {type.replace(/^\w/, (c) => c.toUpperCase())} Node
        </DndNode>
      ))}
    </PaletteContainer>
  );
};

const getId = () => nanoid()

export default () => {
  const [elements, setElements] = useState<Elements>([]);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams | null>(null);

  const { data: icComps } = useGetComponentsWithTypeQuery("gobot")
  const [ createComp ] = useCreateComponentMutation()
  useEffect(() => {
    if (icComps && Object.keys(icComps).length === 0) createComp({ type: "gobot" })
  }, [icComps, createComp])
  const compId = icComps && Object.keys(icComps).length > 0 ? Object.keys(icComps)[0] : null

  const { data: flowsRes } = useGetComponentDataWithTypeQuery({ compId: compId || "", dataType: "flow" }, { skip: !compId }) as { data?: { [id: string]: FlowRes } };
  const [currentFlowId, setCurrentFlowId] = useState<string | undefined>()
  const currentFlowRes = currentFlowId && flowsRes ? flowsRes[currentFlowId] : null
  const [createData] = useCreateDataMutation()
  const [updateData] = useUpdateDataMutation();

  const { data: trainStatus } = useGetTrainingQuery({ compId: compId || "" }, { skip: !compId, pollingInterval: 3000 })
  const [startTrain] = usePostTrainingMutation()
  const canTrain = compId && currentFlowRes && (!trainStatus || trainStatus.status === "failed")
  const [sendMsg, { data: testRes, isLoading: isFetchingTestRes }] = useInteractMutation()
  const [msgHist, setMsgHist] = useState<string[]>([])
  useEffect(() => {
    //@ts-ignore
    if (testRes) setMsgHist(h => [...h, testRes.text])
  }, [testRes])

  useEffect(() => {
    if (compId && flowsRes) {
      if (Object.keys(flowsRes).length === 0) createData({ compId, dataType: "flow", data: { el: [] } })
      else (setCurrentFlowId(Object.keys(flowsRes)[0]), setElements(flowsRes[Object.keys(flowsRes)[0]].el))
    }
  }, [flowsRes])

  useEffect(() => {
    if (currentFlowRes && compId)
    updateData({ compId, dataType: "flow", dataId: currentFlowId as string, newData: { el: elements }});
  }, [elements])

  if (!compId) return <div>Loading...</div>

  const onElementsRemove = (elementsToRemove: any) =>
    setElements((els) => removeElements(elementsToRemove, els) as any);
  const onEdgeUpdate = (oldEdge: any, newConnection: any) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els) as any);
  const onConnect = (params: any) => setElements((els) => addEdge(params, els) as any);

  const onDataChange = (nodeId: string, newData: object) => (console.log('update', nodeId, newData), setElements(
    (els) => els.map((el) => {
      if (el.id === nodeId) return { ...el, data: { ...newData } }
      else return el
    })
  ))

  const onDelete = (nodeId: string) => (console.log(elements), setElements(
    //@ts-ignore
    (els) => els.filter((el) => el.id !== nodeId && el.source !== nodeId && el.target !== nodeId)
  ))

  const onLoad = (reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(reactFlowInstance)
    // reactFlowInstance.fitView();
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const id = getId()
    const newNode = {
      id,
      type,
      position,
      sourcePosition: 'right',
      targetPosition: 'left',
      data: {},
    } as Elements[number];

    setElements((es) => es.concat(newNode));
  };

  const handleTrain = () => (startTrain({ compId }), setMsgHist([]))
  const handleTest = (testMsg: string) => (sendMsg({ compId, msg: [testMsg] }), setMsgHist(h => [...h, testMsg]))

  return (
    <ColumnsContainer>
      <Column>
        <DeleteNoteCbContext.Provider value={onDelete}>
        <ActiveComponentIdContext.Provider value={compId}>
        <UpdateNodeDataContext.Provider value={onDataChange}>
          <FlowWrapper ref={reactFlowWrapper}>
            <ReactFlow
              snapToGrid
              zoomOnScroll={false}
              preventScrolling={false}
              nodeTypes={nodeTypes}
              elements={elements}
              onLoad={onLoad}
              onEdgeUpdate={onEdgeUpdate}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <Controls />
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="#81818a88"
                />
            </ReactFlow>
          </FlowWrapper>
        </UpdateNodeDataContext.Provider>
        </ActiveComponentIdContext.Provider>
        </DeleteNoteCbContext.Provider>
      </Column>

      <Column maxwidth="300px">
        <RowContainer>
        <Row maxheight="50%"><Palette/></Row>
            <Row>
              <ColumnHeader><ColumnTitle>test out the bot</ColumnTitle></ColumnHeader>

              {canTrain
                ? <_CentMsgCont><button onClick={handleTrain}>Click here to train!</button></_CentMsgCont>
                : trainStatus?.status === "running"
                  ? <_CentMsgCont>Training...</_CentMsgCont>
                  : ( isFetchingTestRes ? 
                    <_CentMsgCont>Fetching...</_CentMsgCont>
                    : <Chat>
                        {msgHist.map((m, idx) => idx % 2 == 0 ? <ChatBubbleLeft><ChatBubbleCont>{m}</ChatBubbleCont></ChatBubbleLeft> : <ChatBubbleRight><ChatBubbleContDark>{m}</ChatBubbleContDark></ChatBubbleRight>)}
                        <ChatInput type="text" placeholder="Type a message here..." onKeyDown={(ev) => ev.key === "Enter" && (ev.target as HTMLInputElement).value !== "" && handleTest((ev.target as HTMLInputElement).value)} />
                      </Chat>
                  )
              }
            </Row>
        </RowContainer>
      </Column>
    </ColumnsContainer>
  );
};

const Chat = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  overflowY: "auto",
  position: "relative",
  marginBottom: "10px"
})

const ChatInput = styled("input")({
  width: "100%",
  height: "2rem",
  position: "absolute",
  bottom: 0
})

const ChatBubbleLeft = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "start"
})

const ChatBubbleRight = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "end"
})

const ChatBubbleCont = styled("div")({
  padding: "10px",
  margin: "7px",
  borderRadius: "20px",
  maxWidth: "50%",
  border: "solid 1px #444141",
})

const ChatBubbleContDark = styled(ChatBubbleCont)({
  backgroundColor: "#444141",
  color: 'white'
})

const NodeContainer = styled("div")(({ theme }) => ({
  width: "250px",
  borderRadius: "15px",
  backgroundColor: 'white',
  border: `1px solid ${theme.logoBg}`,
}))

const NodeTitle = styled("div")(({ theme }) => ({
  padding: "15px",
  width: "100%",
  textAlign: "center",
  borderRadius: "15px",
  borderBottom: `1px solid ${theme.logoBg}`,
}))

const NodeBody = styled("div")({
  padding: "10px",
  width: "100%",
})

const DndNode = styled(NodeContainer)({
  padding: "15px",
  width: "100%",
  marginBottom: "20px",
  cursor: "grab"
})

const PaletteContainer = styled("aside")({
  padding: "15px"
})

const FlowWrapper = styled("div", React.forwardRef)({
  width: "100%",
  height: "100%"
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

const _CentMsgCont = styled("div")({
  alignSelf: "stretch",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

