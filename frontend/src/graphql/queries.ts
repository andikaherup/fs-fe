import { gql } from '@apollo/client';

export const GET_MAINTENANCE_REQUESTS = gql`
  query GetMaintenanceRequests {
    maintenanceRequests {
      id
      title
      description
      status
      urgency
      createdAt
      resolvedAt
    }
  }
`;

export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      openRequests
      averageResolutionTime
      urgentRequests
    }
  }
`;

export const CREATE_REQUEST = gql`
  mutation CreateRequest($input: CreateMaintenanceInput!) {
    createRequest(input: $input) {
      id
      title
      status
      urgency
    }
  }
`;

export const RESOLVE_REQUEST = gql`
  mutation ResolveRequest($id: String!) {
    resolveRequest(id: $id) {
      id
      status
      resolvedAt
    }
  }
`;