import { nanoid } from "nanoid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Resource } from "@dp-builder/api-types";
import { useAppSelector } from "../storeHooks";

export interface ResourcesSliceState {
  [resId: string]: Resource;
}

interface ResourceUpdate {
  resId: string;
  newRes: Resource;
}

const initialState: ResourcesSliceState = {};

export const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    createResource(
      state: ResourcesSliceState,
      { payload: newRes }: PayloadAction<Resource>
    ) {
      const newId = nanoid();
      state[newId] = newRes;
    },

    updateResource(
      state: ResourcesSliceState,
      { payload: { resId, newRes } }: PayloadAction<ResourceUpdate>
    ) {
      state[resId] = newRes;
    },

    deleteResource(
      state: ResourcesSliceState,
      { payload: resId }: PayloadAction<string>
    ) {
      delete state[resId];
    },
  },
});

export const { createResource, updateResource, deleteResource } =
  resourcesSlice.actions;
export const resourcesReducer = resourcesSlice.reducer;

export const useResource = (resId: string) =>
  useAppSelector(({ resources }) => resources[resId]);
export const useResources = () => useAppSelector(({ resources }) => resources);
export const useResourcesWithType = (resType: Resource["type"]) =>
  useAppSelector(({ resources }) =>
    Object.keys(resources).filter((id) => resources[id].type === resType)
  );
