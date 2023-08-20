import axios from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeBase64ToJson } from '@/utils/base64';

interface TokenObject {
  message: string;
}

export default async function sentMessages( req: NextApiRequest, res: NextApiResponse ) {
  // await cookie
  const cookies = cookie.parse( req?.headers?.cookie ? req.headers.cookie : '' );
  const authToken = cookies.auth_token || '' ;
  const tokenObject = decodeBase64ToJson( authToken ) as TokenObject;

  if ( req.method !== 'POST' ) {
    res.setHeader( 'Allow', 'POST' );
    res.status( 405 ).json( { message: `Method ${req.method} not allowed` })
    return;
  }

  if (!authToken) {
    res.status( 401 ).json( { message: 'User unauthorized' });
    return;
  }

  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      message: req.body.message,
      to: req.body.to,
      from: req.body.from,
    }, {
      headers: {
        Authorization: `Bearer ${tokenObject.message}`,
      },
      withCredentials: true,
    });

    res.status( 200 ).json( data );
  } catch (err) {
    res.status( 401 ).json( { message: 'User unauthorized' });
  }
}
