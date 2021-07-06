import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { Resource } from "@dp-builder/api-types";

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
        body
      }),
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }]
    }),
    updateResource: build.mutation<Resource, Partial<Resource>>({
      query: (body) => ({
        url: `/res/${body.resid}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (result) => (console.log('invalidate', result?.resid), result ? [{ type: 'Resource', id: result.resid }] : [])
    })
  })
})

export const { useGetResourcesWithTypeQuery, useCreateResourceMutation, useUpdateResourceMutation } = resourceApi;

