import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://example.com" }),
  tagTypes: [],
  endpoints: (build) => ({
    getresApiResResidGet: build.query<
      GetresApiResResidGetApiResponse,
      GetresApiResResidGetApiArg
    >({
      query: (queryArg) => ({ url: `/api/res/${queryArg.resid}` }),
    }),
    putresApiResResidPut: build.mutation<
      PutresApiResResidPutApiResponse,
      PutresApiResResidPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/res/${queryArg.resid}`,
        method: "PUT",
        body: queryArg.intent,
      }),
    }),
    findresApiResGet: build.query<
      FindresApiResGetApiResponse,
      FindresApiResGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/res`,
        params: { type: queryArg.type },
      }),
    }),
    trainApiResResidTrainPost: build.mutation<
      TrainApiResResidTrainPostApiResponse,
      TrainApiResResidTrainPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/res/${queryArg.resid}/train`,
        method: "POST",
      }),
    }),
  }),
});
export type GetresApiResResidGetApiResponse =
  /** status 200 Successful Response */ Intent;
export type GetresApiResResidGetApiArg = {
  resid: string;
};
export type PutresApiResResidPutApiResponse =
  /** status 200 Successful Response */ any;
export type PutresApiResResidPutApiArg = {
  resid: string;
  intent: Intent;
};
export type FindresApiResGetApiResponse =
  /** status 200 Successful Response */ Intent;
export type FindresApiResGetApiArg = {
  type?: string;
};
export type TrainApiResResidTrainPostApiResponse =
  /** status 200 Successful Response */ any;
export type TrainApiResResidTrainPostApiArg = {
  resid: string;
};
export type Content = {
  name: string;
  examples: string[];
};
export type Intent = {
  type: string;
  content: Content;
};
export type ValidationError = {
  loc: string[];
  msg: string;
  type: string;
};
export type HTTPValidationError = {
  detail?: ValidationError[];
};
export const {
  useGetresApiResResidGetQuery,
  usePutresApiResResidPutMutation,
  useFindresApiResGetQuery,
  useTrainApiResResidTrainPostMutation,
} = api;
