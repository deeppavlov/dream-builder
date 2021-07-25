import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { Resource } from "@dp-builder/api_types_ts";

export interface Task {
  type: string;
  target: string;
  inputs: string[];
}

export const resourceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ["Resource"],
  endpoints: (build) => ({
    getResourcesWithType: build.query<Resource[], string>({
      query: (type: string) => ({ url: `/res?type=${type}` }),
      providesTags: (result) => [...(result ? result.map(({ resid }) => ({ type: "Resource" as const, id: resid })) : []), { type: "Resource", id: "LIST" }]
    }),
    getResource: build.query<Resource, string>({
      query: (resId: string) => ({ url: `/res/${resId}` }),
      providesTags: (result) => result ? [{ type: "Resource", id: result.resid }] : []
    }),

    createResource: build.mutation<Resource, Omit<Resource, "resid">>({
      query: (body) => ({
        url: `/res`,
        method: "POST",
        body: { ...body, resid: "" }
      }),
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }]
    }),
    updateResource: build.mutation<Resource, Partial<Resource>>({
      query: (body) => ({
        url: `/res/${body.resid}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (result) => result ? [{ type: 'Resource', id: result.resid }] : []
    }),

    startTask: build.mutation<string, Task>({
      query: ({ type, target, inputs }) => ({
        url: `/tasks/${type}/${target}`,
        method: "POST",
        body: { input: inputs }
      })
    }),

    getTaskState: build.query<string, string>({
      query: (taskId) => ({ url: `/tasks/state/${taskId}` })
    }),

    testModel: build.query<[string, number[][]], { param: string, target: string }>({
      query: ({ param, target }) => ({ url: `/test/${target}`, method: "POST", body: { input: [param] } })
    })
  })
})

export const { useGetResourcesWithTypeQuery, useCreateResourceMutation, useUpdateResourceMutation, useStartTaskMutation, useGetTaskStateQuery, useTestModelQuery } = resourceApi;

