import {
  DynamoDB,
  DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, GetCommand } from '@aws-sdk/lib-dynamodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_LOCAL as string,
    secretAccessKey: process.env.AWS_SECRET_KEY_LOCAL as string,
  },
  region: process.env.AWS_REGION_LOCAL,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export interface RoundRobinState {
  completed: number;
  total: number;
  remaining: number;
  timestamp: string;
  bracket?: string;
  active: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoundRobinState | { message: string }>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.name) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  try {
    const result = await client.send(
      new GetCommand({
        TableName: process.env.AWS_TABLE_NAME,
        Key: {
          pk: 'state:round-robin-state',
          sk: 'state:round-robin-state',
        },
      }),
    );

    if (!result.Item) {
      return res.status(200).json({
        completed: 0,
        total: 0,
        remaining: 0,
        timestamp: '',
        active: false,
      });
    }

    // Parse item_status which is in format "numerator/denominator"
    const itemStatus = result.Item.item_status as string;
    const [numeratorStr, denominatorStr] = itemStatus.split('/');
    const completed = parseInt(numeratorStr, 10) || 0;
    const total = parseInt(denominatorStr, 10) || 0;
    const remaining = total - completed;

    return res.status(200).json({
      completed,
      total,
      remaining,
      timestamp: result.Item.timestamp as string || '',
      bracket: result.Item.bracket as string | undefined,
      active: total > 0,
    });
  } catch (error) {
    console.error('Error fetching round robin state:', error);
    return res.status(500).json({ message: 'Failed to fetch round robin state.' });
  }
}
