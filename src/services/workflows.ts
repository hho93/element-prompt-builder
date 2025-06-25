import client from "./api-client";

const getPaginatedWorkflows = async (
  params: {
    page: number;
    per_page: number;
  },
  token: string,
) => {
  const response = await client.get(`/workflows/pagination`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data ?? {};
};

const workflowService = {
  getPaginatedWorkflows,
};

export default workflowService;
