import { FieldResolveInput } from 'stucco-js';
import { getUrl } from '../S3';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'getFile', async ({ fileKey }) => {
    const fileSignedUrl = await getUrl(fileKey);
    return fileSignedUrl;
  })(input.arguments);
