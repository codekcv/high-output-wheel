import { request } from 'graphql-request';
import useSWR, { responseInterface } from 'swr';

const API = 'http://localhost:3000/api';

export const useQuery = (query: string): responseInterface<unknown, unknown> => {
  return useSWR(query, (query: string) => {
    return request(API, query);
  });
};
