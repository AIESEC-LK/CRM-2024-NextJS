import { NextResponse } from "next/server";
import axios from 'axios';

const MICROSOFT_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID
const MICROSOFT_TENANT_ID = process.env.AZURE_AD_TENANT_ID
const MICROSOFT_CLIENT_SECRET = process.env.AZURE_AD_CLIENT_SECRET
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