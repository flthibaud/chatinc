import Head from 'next/head';
import { Inter } from 'next/font/google'
import { decodeBase64ToJson } from '@/utils/base64';
import { setUserInfo } from '@/store/slice/authSlice';
import { wrapper } from "../store/store";
import axios from 'axios'

import Main from '@/components/Main';

interface TokenObject {
  message: string;
}

const inter = Inter({ subsets: ['latin'] })

export default function Home({ user }) {
  console.log(user)
  return (
    <>
      <Head>
        <title>Home | Whatsapp</title>
      </Head>
      <Main />
    </>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async (context) => {
      const { req } = context;
      const token = req.cookies.auth_token;

      if (!token) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        }
      }

      const tokenObject = decodeBase64ToJson( token ) as TokenObject;

      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${tokenObject.message}`,
          },
          withCredentials: true,
        });

        store.dispatch(setUserInfo(data.data));
    
        return {
          props: {
            user: data,
          },
        }
      } catch (err) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        }
      }
    }
);
