import AWS from 'aws-sdk';
import crypto from 'crypto';

interface S3Client {
  client: AWS.S3;
  bucket: string;
}

let s3: S3Client | undefined;

function getEnv<T extends string>(val: T[]): Record<T, string> {
  const ret: Partial<Record<T, string>> = {};
  for (const k of val) {
    if (!(k in process.env)) {
      throw new Error(`${k} is required`);
    }
    ret[k] = process.env[k];
  }

  return ret as Record<T, string>;
}

const S3Client = () => {
  if (s3) return s3;

  const { SPACES_BUCKET, SPACES_REGION, SPACES_KEY, SPACES_SECRET } = getEnv([
    'SPACES_BUCKET',
    'SPACES_REGION',
    'SPACES_KEY',
    'SPACES_SECRET',
  ]);

  const spacesEnpoint = new AWS.Endpoint(`${SPACES_REGION}.digitaloceanspaces.com`);

  s3 = {
    client: new AWS.S3({
      endpoint: spacesEnpoint,
      accessKeyId: SPACES_KEY,
      secretAccessKey: SPACES_SECRET,
    }),
    bucket: SPACES_BUCKET,
  };

  return s3;
};

const genRandomString = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);

export const putUrl = async ({
  filename,
  contentType,
}: {
  filename: string;
  contentType: string;
}): Promise<{ fileKey: string; putUrl: string }> => {
  const fileKey = `${genRandomString(16)}-${filename}`;

  const s3 = S3Client();
  const params = {
    Bucket: s3.bucket,
    Key: fileKey,
    ContentType: contentType,
    ACL: 'public-read',
  };
  const putUrl = s3.client.getSignedUrl('putObject', {
    ...params,
  });

  return {
    fileKey,
    putUrl,
  };
};

export const getUrl = async (fileKey: string | undefined): Promise<string> => {
  if (!fileKey || fileKey === '') return '';
  if (fileKey.includes('https')) return fileKey;

  const s3 = S3Client();
  const params = {
    Bucket: s3.bucket,
    Key: fileKey,
  };
  const getUrl = s3.client.getSignedUrl('getObject', {
    ...params,
  });

  return getUrl;
};
