import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { Intent, Slot, Flow } from "@dp-builder/cotypes/ts/data";

import type {
  Data,
  Component,
  Training,
  Message,
} from "@dp-builder/cotypes/ts/common";

export interface DataWithContent<T> extends Data {
  content: T;
}

type DataTypes = {
  flow: Flow;
  intent: Intent;
  slot: Slot;
};

export const resourceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Project", "Component", "Data", "Training", "Message"],
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
          ? res.map(({ id }) => ({
              type: "Data" as const,
              id: id,
            }))
          : []),
        { type: "Data", id: "LIST" },
      ],
    }),
    createData: build.mutation<
      DataWithContent<object>,
      { compId: number; dataType: string; data: object }
    >({
      query: ({ compId, dataType, data }) => ({
        url: `/components/${compId}/${dataType}s`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (id) =>
        id ? [{ type: "Data", id: "LIST" }, "Training"] : [],
    }),
    updateData: build.mutation<null, { dataId: number; newData: object }>({
      query: ({ dataId, newData }) => ({
        url: `/data/${dataId}`,
        method: "PUT",
        body: newData,
      }),
      invalidatesTags: (_, __, { dataId }) => [
        { type: "Data", id: dataId },
        "Training",
      ],
    }),
    deleteData: build.mutation<null, { dataId: number }>({
      query: ({ dataId }) => ({
        url: `/data/${dataId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { dataId }) => [
        { type: "Data", id: dataId },
        { type: "Data", id: "LIST" },
        "Training",
      ],
    }),

    postTraining: build.mutation<null, { compId: number }>({
      query: ({ compId }) => ({
        url: `/components/${compId}/trainings`,
        method: "POST",
      }),
      invalidatesTags: ["Training"],
    }),
    getTraining: build.query<Training, { compId: number }>({
      query: ({ compId }) => ({ url: `/components/${compId}/last_training` }),
      providesTags: ["Training"],
      // transformResponse: (a, b) => {a, b?.response.ok}
    }),

    messages: build.query<Message[], number>({
      query: (trainId) => `/trainings/${trainId}/messages`,
      providesTags: (_, __, trainId) => [{ type: "Message", id: trainId }],
    }),
    interact: build.mutation<Message, { trainId: number; msg: Message }>({
      query: ({ trainId, msg }) => ({
        url: `/trainings/${trainId}/messages`,
        method: "POST",
        body: msg,
      }),
      invalidatesTags: (_, __, { trainId }) => [
        { type: "Message", id: trainId },
      ],
    }),
  }),
});

export function useComponent(compType: string) {
  const { data: components = [] } =
    resourceApi.useGetComponentsQuery("default");
  const comp = components.find(({ type }) => type === compType);

  const lastTraining = resourceApi.endpoints.getTraining.useQueryState(
    { compId: comp?.id as number },
    {
      skip: !comp,
      selectFromResult: (res) => (res.error ? undefined : res.data),
    }
  );
  resourceApi.endpoints.getTraining.useQuerySubscription(
    { compId: comp?.id as number },
    {
      skip: !comp,
      pollingInterval: lastTraining?.status === "RUNNING" ? 3000 : undefined,
    }
  );

  const { data: messages, isFetching: isFetchingMessages } =
    resourceApi.useMessagesQuery(lastTraining?.id as number, {
      skip: !lastTraining,
    });
  const [_postTraining] = resourceApi.usePostTrainingMutation();
  const [_postMessage, { isLoading: isInteractInProgress }] =
    resourceApi.useInteractMutation();

  const train = () => {
    if (!comp) return;
    _postTraining({ compId: comp.id });
  };

  const interact = (msg: Message) => {
    if (!comp || !lastTraining?.id) return;
    _postMessage({ trainId: lastTraining.id, msg });
  };

  return {
    component: comp,
    canTrain: comp && (!lastTraining || lastTraining.status === "FAILED"),
    trainingStatus: lastTraining?.status,
    isFetchingTestRes: isInteractInProgress || isFetchingMessages,
    train,
    interact,
    messages,
  };
}

export function useData<
  D extends string & keyof DataTypes,
  T extends object = DataTypes[D]
>(compId: number | undefined, dataType: D) {
  const { data, isFetching } = resourceApi.useGetComponentDataWithTypeQuery(
    { compId: compId as number, dataType },
    { skip: compId === undefined }
  );
  const [_createData] = resourceApi.useCreateDataMutation();
  const [_updateData] = resourceApi.useUpdateDataMutation();
  const [_deleteData] = resourceApi.useDeleteDataMutation();

  const createData = async (
    newDataContent: T
  ): Promise<DataWithContent<T> | null> => {
    if (compId === undefined) return null;

    const res = await _createData({
      compId: compId,
      dataType,
      data: newDataContent,
    });
    return "data" in res ? (res.data as DataWithContent<T>) : null;
  };

  const updateData = (dataId: number, newDataContent: T) => {
    if (compId === undefined) return;
    _updateData({ newData: newDataContent, dataId });
  };

  const deleteData = (dataId: number) => {
    if (compId === undefined) return;
    _deleteData({ dataId });
  };

  return {
    data: (data || []) as DataWithContent<T>[],
    isLoading: isFetching || !compId || !data,
    createData,
    updateData,
    deleteData,
  };
}
