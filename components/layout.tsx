import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export const name = 'Shiina'
export const siteTitle = `${name} — Link Shortener`

export default function Layout({
  children,
  home
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <div className="hero min-h-screen">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`${siteTitle} by satont`}
        />
        {/* <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        /> */}
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className='text-center hero-content'>
        <div className='max-w-md'>
        <div className='mb-5'>
            <Image
              priority
              src="/images/profile.png"
              height={144}
              width={144}
              className='rounded-full'
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
