import React from "react";

import { IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RiMarkPenLine } from "react-icons/ri";
import { BiUserVoice } from "react-icons/bi";

import PipelineIcon from "./icons/pipelineIcon.svg";
import SelectorIcon from "./icons/selectorIcon.svg";

import Discourse from "./Discourse";
import Intents from "./Intents";
import Pipeline from "./Pipeline";
import Skills from "./Skills";
import Selector from "./Selector";
import Annotators from "./Annotators";

type EditorComponent = React.ComponentType<{ openSubpage?: string }>;

export interface EditorType {
  name: string;
  Icon: React.ComponentType<{ iconSize: string }>;
  Editor: EditorComponent;
  subeditors?: EditorType[];
}

const editors: EditorType[] = [
  {
    name: "Discourse",
    Icon: ({ iconSize }) => <IoChatbubblesOutline size={iconSize} />,
    Editor: Discourse,
  },
  {
    name: "Pipeline",
    Icon: ({ iconSize }) => (
      <PipelineIcon style={{ width: iconSize, height: iconSize }} />
    ),
    Editor: Pipeline,
    subeditors: [
      {
        name: "Skills",
        Icon: ({ iconSize }) => <HiOutlineLightBulb size={iconSize} />,
        Editor: Skills,
      },
      {
        name: "Response Selector",
        Icon: ({ iconSize }) => (
          <SelectorIcon style={{ width: iconSize, height: iconSize }} />
        ),
        Editor: Selector,
      },
      {
        name: "Annotators",
        Icon: ({ iconSize }) => (
          <RiMarkPenLine size={iconSize} style={{ transform: "scale(0.9)" }} />
        ),
        Editor: Annotators,
      },
    ],
  },
  {
    name: "Intents",
    Icon: ({ iconSize }) => <BiUserVoice size={iconSize} />,
    Editor: Intents,
  },
];

export default editors;
