import { FieldResolveInput } from 'stucco-js';
import { putUrl } from '../S3';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'uploadFile', async ({ fileInput: { filename, contentType } }) => {
    const putObjectResponse = await putUrl({ filename, contentType });
    return putObjectResponse;
  })(input.arguments);
