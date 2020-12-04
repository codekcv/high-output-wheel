import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation($id: Int!, $sharer: Boolean, $done: Boolean) {
    updateUser(id: $id, sharer: $sharer, done: $done) {
      id
    }
  }
`;
