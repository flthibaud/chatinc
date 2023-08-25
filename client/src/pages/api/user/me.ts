import axios from 'axios';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeBase64ToJson } from '@/utils/base64';

interface TokenObject {
  message: string;
}

export default async function me( req: NextApiRequest, res: NextApiResponse ) {
  // await cookie
  const cookies = cookie.parse( req?.headers?.cookie ? req.headers.cookie : '' );
  const authToken = cookies.session || '' ;
  const tokenObject = decodeBase64ToJson( authToken ) as TokenObject;

  if ( req.method !== 'GET' ) {
    res.setHeader( 'Allow', 'GET' );
    res.status( 405 ).end( 'Method Not Allowed' );
    return;
  }

  if (!authToken) {
    res.status( 401 ).end( 'Unauthorized' );
    return;
  }

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${tokenObject.message}`,
      },
      withCredentials: true,
    });

    res.status( 200 ).json( data );
  } catch (err) {
    console.log(err);
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || 'Internal Server Error' });
  }
}
