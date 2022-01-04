import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Link as DbLink } from '@prisma/client' 
import utilStyles from '../../styles/utils.module.css'

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
  const { data, error } = useSWR<DbLink>(() => `/api/links/${query.param[0]}/${query.param[1] ?? ''}`, fetcher)

  if (!data && !error) return <div>Loading...</div>

  return (
    <Layout>
      {error ? 
      <>
        <div className={utilStyles.center} style={{ color: '#bf4d3e' }}>{error.message}</div>
      </> : 
      <>
        {window.location.replace(data.link)}
      </>}
    </Layout>
  )
}
