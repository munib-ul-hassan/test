// typedefs/index.js
import { gql } from "apollo-server";

import AuthtypeDefs from  "./authTypedef.js"

const rootTypeDefs = gql`
  type Query
  type Mutation
`;

const typeDefs = [rootTypeDefs, AuthtypeDefs];

export default typeDefs;
