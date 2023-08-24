import axios from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeBase64ToJson } from '@/utils/base64';

interface TokenObject {
  message: string;
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default async function sentImageMessage( req: NextApiRequest, res: NextApiResponse ) {
  // await cookie
  const { headers: { cookie, ...rest }, method } = req;
  const cookies = parse( cookie );
  const authToken = cookies.auth_token || '' ;
  const tokenObject = decodeBase64ToJson( authToken ) as TokenObject;

  const from = req.query.from as string;
  const to = req.query.to as string;

  if ( method !== 'POST' ) {
    res.setHeader( 'Allow', 'POST' );
    res.status( 405 ).json( { message: `Method ${req.method} not allowed` })
    return;
  }

  if (!authToken) {
    res.status( 401 ).json( { message: 'User unauthorized' });
    return;
  }

  const headers = {
    Authorization: `Bearer ${tokenObject.message}`,
    'content-type': rest['content-type'], 
    'content-length': rest['content-length']
  }

  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/image-message?from=${from}&to=${to}`, req, {
      headers: headers,
      withCredentials: true,
    });

    res.status( 200 ).json( data );
  } catch (err) {
    res.status( 401 ).json( { message: 'User unauthorized' });
  }
}
