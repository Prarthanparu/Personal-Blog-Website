
import Head from 'next/head'
import Header from '../Components/Header';
import {sanityClient, urlFor} from '../sanity';
import {Post} from '../typings';
import Link from 'next/link';
interface Props{
  posts:[Post];
}

export default function Home({posts}:Props) {
  console.log(posts);
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Blog Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
    <div className="flex justify-between items-center bg-darkorange border-y border-black py-10 lg:">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-poppins">
          <span className="underline decoration-black decoration-4 ">Blogger</span>{" "}
           is Place For Reading, Writing and Connecting.</h1>
           <h2>Its easy and free to post your thoughts on any topics and connect with millions of others</h2>
      </div>
      <img className="hidden md:inline-flex h-32 lg:h-full " 
      src="https://play-lh.googleusercontent.com/cWG9-bk2_zLdKsN9vsYEdbCReVfzgXU6FeHUmLI8a24FoZ05TpOLYXInCQ278FTwCw" alt="" />
    </div>
    {/* {posts} */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
    md:gap-6 p-2 md:p-6
    ">
      {posts.map((post)=>(
        <Link key={post._id} href={`/post/${post.slug.current}`}>
        <div className="group border rounded-lg cursor-pointer">
          <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out" src={urlFor(post.mainImage).url()!} alt="" />
          <div className="flex justify-between p-5 bg-white">
            <div>
              <p className="text-lg font-bold">{post.title}</p>
              <p className="text-xs">{post.description} by {post.author.name}</p>
            </div>
            <img className="h-12 w-12 rounded-full" src={urlFor(post.author.image).url()!} alt="" />
          </div>
        </div>
        </Link>
      ))}
    </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,
  title,
  slug,
  author->{
  name,
  image
},
description,
mainImage,
slug
  
}`;
const posts = await sanityClient.fetch(query);
return {
  props: {
    posts,
},
} 
}
