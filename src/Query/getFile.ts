import path from 'path';
import { FieldResolveInput } from 'stucco-js';
import { getUserFromSource } from '../protect';
import { getUrl } from '../S3';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'getFile', async ({ fileKey }) => {
    const protect = getUserFromSource(input);
    const storedKeyName = protect ? path.join(protect, fileKey) : fileKey;
    const fileSignedUrl = await getUrl(storedKeyName);
    return fileSignedUrl;
  })(input.arguments);
