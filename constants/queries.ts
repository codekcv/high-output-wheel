import { gql } from '@apollo/client';

export const USERS = gql`
  {
    users {
      id
      name
      img
      done
      sharer
    }
  }
`;
