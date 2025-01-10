import { NextResponse } from "next/server";
import axios from 'axios';

const MICROSOFT_CLIENT_ID = 'e9e02814-1dec-4a1b-9674-a29c7f067378'
const MICROSOFT_TENANT_ID = 'b873c579-6e82-4d42-a7c0-cde7bb250883'
const MICROSOFT_CLIENT_SECRET = 'C2o8Q~9SqgzgsLT4znfR~DUs0lM3RSg~B0My_cq4'

export async function POST() {
  try {
    const tokenEndpoint = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`;
    console.log('Getting token from:', tokenEndpoint);
    const params = new URLSearchParams();
    params.append('client_id', MICROSOFT_CLIENT_ID || '');
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('client_secret', MICROSOFT_CLIENT_SECRET || 'C2o8Q~9SqgzgsLT4znfR~DUs0lM3RSg~B0My_cq4');
    params.append('grant_type', 'client_credentials');

    const response = await axios.post(tokenEndpoint, params);
    
    return NextResponse.json({ 
      access_token: response.data.access_token 
    });
  } catch (error) {
    const err = error as any;
    console.error('Error getting token:', err);
    console.error('Error getting token:', err.response ? err.response.data : err.message);

    return NextResponse.json({ 
      message: 'Failed to get token', 
      error: (error as any).message
    }, { status: 500 });
  }
}