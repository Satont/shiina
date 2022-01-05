import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Link as DbLink } from '@prisma/client' 

async function fetcher(url: string) {
  const res = await fetch(url)
  const data = await res.json()
  
  if (res.status !== 200) {
    throw new Error(data.error)
  }
  
  return data
}

export default function Link() {
  const { query } = useRouter()
  const code = query.param[0]
  const secretCode = query.param[1]
  const secret = secretCode ? `/${secretCode}` : ''
  const { data, error } = useSWR<DbLink>(() => `/api/links/${code}${secret}`, fetcher)

  if (!data && !error) return <div>Loading...</div>

  return (
    <Layout>
      {error ? 
      <>
        <div style={{ color: '#bf4d3e' }}>{error.message}</div>
      </> : 
      <>
        {window.location.replace(data.link)}
      </>}
    </Layout>
  )
}
