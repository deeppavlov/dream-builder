import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { Intent, Slot, Flow } from "@dp-builder/cotypes/ts/data";
import type {
  Data,
  Component,
  Training,
  Message,
  ResetMessage,
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
    }),

    messages: build.query<Message[], number>({
      query: (trainId) => `/trainings/${trainId}/messages`,
      providesTags: (_, __, trainId) => [{ type: "Message", id: trainId }],
    }),
    interact: build.mutation<
      Message,
      { trainId: number; msg: Message | ResetMessage }
    >({
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

const pendingMessages: { [id: number]: number } = {};

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
  const { refetch: refetchTraining } =
    resourceApi.endpoints.getTraining.useQuerySubscription(
      { compId: comp?.id as number },
      {
        skip: !comp,
        pollingInterval: lastTraining?.status === "RUNNING" ? 3000 : undefined,
      }
    );

  const {
    data: messages,
    isFetching: isFetchingMessages,
    refetch: refetchMessages,
  } = resourceApi.useMessagesQuery(lastTraining?.id as number, {
    skip: !lastTraining,
  });
  const [_postTraining] = resourceApi.usePostTrainingMutation();
  const [_postMessage, { isLoading: isInteractInProgress }] =
    resourceApi.useInteractMutation();

  const train = () => {
    if (!comp) return;
    _postTraining({ compId: comp.id }).then(() => refetchTraining());
  };

  const interact = (msg: Message, debounce = 0) => {
    if (!comp || lastTraining?.id === undefined) return;
    if (lastTraining?.id in pendingMessages) {
      clearTimeout(pendingMessages[lastTraining?.id]);
    }
    pendingMessages[lastTraining?.id] = setTimeout(() => {
      _postMessage({ trainId: lastTraining.id, msg }).then(() =>
        refetchMessages()
      );
      delete pendingMessages[lastTraining?.id];
    }, debounce);
  };

  const reset = () => {
    if (!comp || lastTraining?.id === undefined) return;
    _postMessage({ trainId: lastTraining.id, msg: { type: "reset" } }).then(
      () => refetchMessages()
    );
  };

  return {
    component: comp,
    canTrain: comp && (!lastTraining || lastTraining.status === "FAILED"),
    trainingStatus: lastTraining?.status,
    isFetchingTestRes: isInteractInProgress || isFetchingMessages,
    train,
    interact,
    reset,
    messages: messages || [],
  };
}

const pendingDataUpdates: { [dataId: number]: { timer: number } } = {};

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

  const updateData = (dataId: number, newDataContent: T, debounce = 1000) => {
    if (compId === undefined) return;
    if (pendingDataUpdates[dataId]) {
      clearTimeout(pendingDataUpdates[dataId].timer);
    }
    const timer = setTimeout(() => {
      _updateData({ newData: newDataContent, dataId });
      delete pendingDataUpdates[dataId];
    }, debounce);
    pendingDataUpdates[dataId] = { timer };
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
