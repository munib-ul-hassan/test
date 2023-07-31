import { gql } from "apollo-server";

const AuthCommonFields = `
  _id: ID!
  email: String!
  
   name: String
  

`

const AuthResponseType = `
  type Auth {
    ${AuthCommonFields}
    token: String
  }
`

const CreateProfileResponseType = `
  type CreateProfileResponse {
    _id: ID!
    name: String
    email:String
    token: String
  }
`

const DeleteUserResponseType = `
  type DeleteUserResponse {
    message: String
    
  }
`

const AuthtypeDefs = gql`
  ${AuthResponseType}
  ${DeleteUserResponseType}
  ${CreateProfileResponseType}

  type Query {
    users: [Auth]
    user(id: ID!): Auth
  }

  type Mutation {
    deleteUser(
      id: ID!
    ):DeleteUserResponse!
    createProfile(
      email: String
      password: String!
      name: String      
    ): CreateProfileResponse!
    
    updateUser(
      name: String!
      password: String!      
    ): Auth!
  }
`;

export default AuthtypeDefs;
