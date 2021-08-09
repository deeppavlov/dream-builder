import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { Component, Intent } from "@dp-builder/api_types_ts";

export type Data = Intent | { [k: string]: any }; // TODO: add flow type
type Result<T> = { [resid: string]: T }

export const resourceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ["Component", "Data"],
  endpoints: (build) => ({
    getComponentsWithType: build.query<Result<Component>, string>({
      query: (type) => ({ url: `/components?type=${type}` }),
      providesTags: (res) => [...(res ? Object.keys(res).map((resid) => ({ type: "Component" as const, id: resid })) : []), { type: "Component", id: "LIST" }]
    }),
    createComponent: build.mutation<string, Component>({
      query: (comp) => ({
        url: `/components`,
        method: "POST",
        body: comp
      }),
      invalidatesTags: [{ type: 'Component', id: 'LIST' }]
    }),

    getComponentDataWithType: build.query<Result<Data>, {compId: string; dataType: string}>({
      query: ({ compId, dataType }) => ({ url: `/components/${compId}/${dataType}s` }),
      providesTags: (res) => [...(res ? Object.keys(res).map((resid) => ({ type: "Data" as const, id: resid })) : []), { type: "Data", id: "LIST" }]
    }),
    createData: build.mutation<null, { compId: string, dataType: string, data: Data }>({
      query: ({ compId, dataType, data }) => ({
        url: `/components/${compId}/${dataType}s`,
        method: "POST",
        body: data
      }),
      invalidatesTags: (id) => id ? [{ type: 'Data', id: "LIST" }] : []
    }),

    updateData: build.mutation<null, { compId: string, dataType: string, dataId: string, newData: Data }>({
      query: ({ compId, dataType, dataId, newData }) => ({
        url: `/components/${compId}/${dataType}s/${dataId}`,
        method: "PUT",
        body: newData
      }),
      invalidatesTags: (_, __, { dataId }) => [{ type: 'Data', id: dataId }]
    }),

  })
})

export const { useGetComponentsWithTypeQuery, useCreateComponentMutation, useGetComponentDataWithTypeQuery, useUpdateDataMutation, useCreateDataMutation } = resourceApi;

