import { useCallback, useState } from 'react'
import Layout from '../components/layout'
import Image from 'next/image'

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
    <Layout>
          <div className='form-control'>
            <form onSubmit={handleSubmit}>
              <input 
                type="text"
                placeholder="Link"
                required
                name=""
                id="" {...link}
                className='input input-bordered mb-5 text-lg select-none w-full'
              />

              <input 
                type="text"
                placeholder="Secret for link"
                name=""
                id=""
                className="input input-bordered mb-5 text-lg select-none w-full"
                {...secret} 
              />

              <label className="cursor-pointer label">
                <span className="label-text">One time</span> 
                <input type="checkbox" name="opt" className="checkbox" onChange={() => setOneTime(!oneTime)} value="" />
              </label>

              <button className="btn btn-success btn-block btn-outline mt-5" type="submit">Create</button>
            </form>

            { newLink && 
              <div className="alert alert-success mt-5 flex justify-center">
                  <label><a href={newLink} target="_blank">{newLink}</a></label>
              </div>
            }
          </div>
    </Layout>
  )
}
