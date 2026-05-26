import { handleVercelRequest } from "../src/vercel-handler";

export default {
  fetch: handleVercelRequest,
};
