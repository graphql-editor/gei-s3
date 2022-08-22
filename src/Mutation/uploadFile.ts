import crypto from 'crypto';
import path from 'path';
import { FieldResolveInput } from 'stucco-js';
import { getUserFromSource } from '../protect';
import { putUrl } from '../S3';
import { resolverFor } from '../zeus';

const genRandomString = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'uploadFile', async ({ fileInput: { filename, contentType } }) => {
    const pureKey = `${genRandomString(16)}-${filename}`;
    const protect = getUserFromSource(input);
    const storedKeyName = protect ? path.join(protect, pureKey) : pureKey;
    const putObjectResponse = await putUrl({ fileKey: storedKeyName, contentType });
    return { fileKey: pureKey, putUrl: putObjectResponse.putUrl };
  })(input.arguments);
