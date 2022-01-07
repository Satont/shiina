import { GetServerSideProps } from 'next'
import Layout from '../../components/layout'

export default function Error({ message }: { message: string }) {
  return (
    <Layout>
      <div className="alert alert-error">
        <div className="flex-1">
          <p className="text-sm text-base-content text-opacity-60 break-all">{message}</p>
        </div> 
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { 
    props: {
      message: context.query.message as string ?? 'Unknown error'
    } 
  }
}