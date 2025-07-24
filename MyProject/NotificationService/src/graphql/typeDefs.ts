import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum JobStatus {
    PENDING
    COMPLETED
    FAILED
  }

  type NotificationJob {
    id: ID!
    userId: String!
    message: String!
    status: JobStatus!
    attempts: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ScheduleNotificationInput {
    userId: String!
    message: String!
    sendAt: String!
  }

  type Query {
    jobs(status: JobStatus): [NotificationJob]
    job(id: ID!): NotificationJob
  }

  type Mutation {
    scheduleNotification(input: ScheduleNotificationInput!): NotificationJob
  }
`;
