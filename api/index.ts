import { handleVercelRequest } from "../apps/api/src/vercel-handler";

export default {
  fetch: handleVercelRequest,
};
