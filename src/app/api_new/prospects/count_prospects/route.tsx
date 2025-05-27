import { NextApiRequest, NextApiResponse } from 'next';
import  Prospect  from '@/app/api_new/prospects/count_prospects/prospect_model';
import { MAX_PROSPECTS } from '@/app/lib/values';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userLcId } = req.query;

    if (!userLcId || typeof userLcId !== 'string') {
      return res.status(400).json({ message: 'Invalid userLcId' });
    }

    // Count prospects where userLcId matches and status is 'prospect'
    const prospectCount = await Prospect.countDocuments({ userLcId, status: 'prospect' });

    // Return true if less than 150 prospects
    const result = prospectCount < MAX_PROSPECTS;

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}