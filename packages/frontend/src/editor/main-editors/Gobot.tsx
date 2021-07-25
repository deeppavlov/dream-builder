import React, { useState, useRef } from "react";
import ReactFlow, { Handle, Controls, Background, updateEdge, addEdge, removeElements, OnLoadParams, Elements, NodeTypesType, Position, BackgroundVariant } from 'react-flow-renderer';
import { styled } from "goober";

const UtteranceNode = () => {
  return (
    <NodeContainer>
      <div>User Utterance</div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />
    </NodeContainer>
  )
}

const ApiCallNode = () => {
  return (
    <NodeContainer>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />
      <div>Api Call</div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ top: '50%', borderRadius: 0 }}
      />
    </NodeContainer>
  )
}

const ResponseNode = () => {
  return (
    <NodeContainer>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '50%', borderRadius: 0 }}
      />
      <div>Response</div>
    </NodeContainer>
  )
}

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

let id = 0;
const getId = () => `node-${id++}`;

export default () => {
  const [elements, setElements] = useState<Elements>([]);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams | null>(null);

  const onElementsRemove = (elementsToRemove: any) =>
    setElements((els) => removeElements(elementsToRemove, els) as any);
  const onEdgeUpdate = (oldEdge: any, newConnection: any) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els) as any);
  const onConnect = (params: any) => setElements((els) => addEdge(params, els) as any);

  const onLoad = (reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(reactFlowInstance)
    reactFlowInstance.fitView();
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
    const newNode = {
      id: getId(),
      type,
      position,
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: `${type} node` },
    } as Elements[number];

    setElements((es) => es.concat(newNode));
  };

  return (
    <ColumnsContainer>
      <Column>
        <FlowWrapper ref={reactFlowWrapper}>
          <ReactFlow
            nodeTypes={nodeTypes}
            elements={elements}
            onLoad={onLoad}
            snapToGrid
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
      </Column>

      <Column maxwidth="300px">
        <Palette/>
      </Column>
    </ColumnsContainer>
  );
};

const NodeContainer = styled("div")(({ theme }) => ({
  padding: "15px",
  borderRadius: "15px",
  border: `1px solid ${theme.logoBg}`,
  backgroundColor: 'white'
}))

const DndNode = styled(NodeContainer)({
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
