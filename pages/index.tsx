import { useCallback, useState } from 'react'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

const useFormField = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
  return { value, onChange };
};

export default function Home() {
  const link = useFormField();
  const secret = useFormField();
  const [oneTime, setOneTime] = useState(false)
  const [newLink, setNewLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request = await fetch(`/api/links/new`, {
      method: 'POST',
      body: JSON.stringify({
        link: link.value,
        secret: secret.value,
        oneTime,
      })
    })

    const response = await request.json()
    setNewLink(`${window.origin}/l/${response.slug}${response.secret ? `/${response.secret}` : ''}`)
    link.value = ''
    secret.value = ''
    setOneTime(false)
  };

  return (
    <Layout home>
      {/* <Head>
        <title style={{color: '#fffff'}}>{siteTitle}</title>
      </Head> */}
     {/*  <section className={`${utilStyles.headingMd} ${layoutStyles.header}`}>
        <p>Simple </p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section> */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px} ${utilStyles.center}`} style={{color: '#cccccc'}}>
        <h4 className={utilStyles.headingLg}>Create new short link</h4>
        <form onSubmit={handleSubmit} className={utilStyles.center}>
          <input type="text" placeholder="Enter link" required name="" id="" {...link} />
          <input type="text" placeholder="Enter secret for link" name="" id="" {...secret} />
          <label htmlFor="oneTime">One time</label>
          <input type="checkbox" id="oneTime" onChange={() => setOneTime(!!oneTime)} />

          <button type="submit" className="submit">Create</button>
        </form>

        <h1>{!newLink ? '' : <><a href={newLink} target="_blank">{newLink}</a></>}</h1>
      </section>
    </Layout>
  )
}
