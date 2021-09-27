import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type {
  Data,
  Component,
  Training,
  Message,
} from "@dp-builder/cotypes/ts/common";
import type { Intent, Slot } from "@dp-builder/cotypes/ts/data";

export type DataContent = Intent | Slot | { [k: string]: any }; // TODO: add flow type

export const resourceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Project", "Component", "Data", "Training"],
  endpoints: (build) => ({
    getComponents: build.query<Component[], string>({
      query: (proj_name) => ({ url: `/projects/${proj_name}/components` }),
      providesTags: (res) => [
        ...(res?.map(({ id }) => ({ type: "Component" as const, id })) || []),
        { type: "Component", id: "LIST" },
      ],
    }),

    getComponentDataWithType: build.query<
      Data[],
      { compId: number; dataType: string }
    >({
      query: ({ compId, dataType }) => ({
        url: `/components/${compId}/${dataType}s`,
      }),
      providesTags: (res = []) => [
        ...(res
          ? res.map((_, id) => ({
              type: "Data" as const,
              id: id,
            }))
          : []),
        { type: "Data", id: "LIST" },
      ],
    }),
    createData: build.mutation<
      null,
      { compId: number; dataType: string; data: DataContent }
    >({
      query: ({ compId, dataType, data }) => ({
        url: `/components/${compId}/${dataType}s`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (id) => (id ? [{ type: "Data", id: "LIST" }] : []),
    }),
    updateData: build.mutation<
      null,
      { compId: number; dataType: string; dataId: number; newData: DataContent }
    >({
      query: ({ compId, dataType, dataId, newData }) => ({
        url: `/components/${compId}/${dataType}s/${dataId}`,
        method: "PUT",
        body: newData,
      }),
      invalidatesTags: (_, __, { dataId }) => [{ type: "Data", id: dataId }],
    }),
    deleteData: build.mutation<
      null,
      { compId: number; dataType: string; dataId: number }
    >({
      query: ({ compId, dataType, dataId }) => ({
        url: `/components/${compId}/${dataType}s/${dataId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { dataId }) => [
        { type: "Data", id: dataId },
        { type: "Data", id: "LIST" },
      ],
    }),

    postTraining: build.mutation<null, { compId: number }>({
      query: ({ compId }) => ({
        url: `/components/${compId}/trainings`,
        method: "POST",
      }),
      invalidatesTags: (_, __, { compId }) => [
        { type: "Training", id: compId },
      ],
    }),
    getTraining: build.query<Training, { compId: number }>({
      query: ({ compId }) => ({ url: `/components/${compId}/last_training` }),
      providesTags: (_, __, { compId }) => [{ type: "Training", id: compId }],
    }),

    interact: build.mutation<Message, { compId: number; msg: Message }>({
      query: ({ compId, msg }) => ({
        url: `/components/${compId}/interact`,
        method: "POST",
        body: msg,
      }),
    }),
  }),
});

export function useComponent(compType: string) {
  const { data: components = [] } =
    resourceApi.useGetComponentsQuery("default");
  const comp = components.find(({ type }) => type === compType);
  const { data: lastTraining } = resourceApi.useGetTrainingQuery(
    { compId: comp?.id as number },
    { skip: !comp }
  );
  const [_postTraining] = resourceApi.usePostTrainingMutation();
  const [_postMessage] = resourceApi.useInteractMutation();

  const train = () => {
    if (!comp) return;
    _postTraining({ compId: comp.id });
  };

  const interact = (msg: Message) => {
    if (!comp) return;
    _postMessage({ compId: comp.id, msg });
  };

  return {
    component: comp,
    canTrain: comp && (!lastTraining || lastTraining.status === "FAILED"),
    train,
    interact,
  };
}

export function useData(comp: Component | undefined, dataType: string) {
  const { data = [] } = resourceApi.useGetComponentDataWithTypeQuery(
    { compId: comp?.id || 0, dataType },
    { skip: !comp }
  );
  const [_createData] = resourceApi.useCreateDataMutation();
  const [_updateData] = resourceApi.useUpdateDataMutation();
  const [_deleteData] = resourceApi.useDeleteDataMutation();

  const createData = (newDataContent: DataContent) => {
    if (!comp) return;
    _createData({ compId: comp.id, dataType, data: newDataContent });
  };

  const updateData = (dataId: number, newDataContent: DataContent) => {
    if (!comp) return;
    _updateData({ compId: comp.id, dataType, newData: newDataContent, dataId });
  };

  const deleteData = (dataId: number) => {
    if (!comp) return;
    _deleteData({ compId: comp.id, dataType, dataId });
  };

  return {
    data,
    createData,
    updateData,
    deleteData,
  };
}
