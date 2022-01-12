import { useCallback, useState } from 'react'
import Layout from '../components/layout'

export default function Home() {
  const [link, setLink] = useState('');
  const onLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value), []);
  const [secret, setSecret] = useState('');
  const onSecretChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSecret(e.target.value), []);

  const [oneTime, setOneTime] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNewLink('')
    setError('')

    const request = await fetch(`/api/links/new`, {
      method: 'POST',
      body: JSON.stringify({
        link,
        secret,
        oneTime,
      })
    })

    const response = await request.json()

    if (request.ok) {
      setNewLink(`${window.origin}/l/${response.slug}${response.secret ? `/${response.secret}` : ''}`)
      setLink('')
      setSecret('')
      setOneTime(false)
    } else {
      if (response) {
        setError(response.error)
      }
    }
  };

  return (
    <Layout>
          <div className='form-control'>
            <form onSubmit={handleSubmit}>
              <input 
                type="text"
                placeholder="Link"
                required
                name=""
                id="" 
                onChange={onLinkChange}
                className='input input-bordered mb-5 text-lg select-none w-full'
              />

              <input 
                type="text"
                placeholder="Secret for link"
                name=""
                id=""
                className="input input-bordered mb-5 text-lg select-none w-full"
                onChange={onSecretChange}
              />

              <label className="cursor-pointer label">
                <span className="label-text">One time</span> 
                <input type="checkbox" name="opt" className="checkbox" checked={oneTime} onChange={() => setOneTime(!oneTime)} value="" />
              </label>

              <button className="btn btn-success btn-block btn-outline mt-5" type="submit">Create</button>
            </form>

            { newLink && 
              <div className={`alert alert-success mt-5 flex justify-center`}>
                  <label>
                    <a href={newLink} target="_blank">{newLink}</a>
                  </label>
              </div>
            }
            { error && 
              <div className={`alert alert-error mt-5 flex justify-center`}>
                  <label>
                    {error}
                  </label>
              </div>
            }
          </div>
    </Layout>
  )
}
