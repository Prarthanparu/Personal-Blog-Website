import Header from '../../Components/Header';
import {sanityClient, urlFor} from "../../sanity";
import {Post} from "../../typings";
import {GetStaticProps} from "next";
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';

interface IFormInput{
    _id:string;
    name:string;
    email: string;  
    comment:string;
}

interface Props{
    post:Post;
}

function Post({post}:Props) {

    const [submitted, setSubmitted] = useState(false);
    console.log(post);

    const {register, handleSubmit,formState: {errors}} = useForm<IFormInput>();

    const onSubmit : SubmitHandler<IFormInput> = async(data)=>{
        
        await fetch('/api/createComment',{
            method:'POST',
            body:JSON.stringify(data),
        }).then(()=>{
            console.log(data)
            setSubmitted(true);
        }).catch((err)=>{
            console.log(err)
            setSubmitted(false);
        })    
    };

    console.log(post);
    return <div>    
        <Header/>
        <img className="w-full h-40 object-cover" src={urlFor(post.mainImage).url()!} alt="" />
    <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center space-x-2">
            <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url()!} alt="" />
            <p className="font-extralight text-sm">Blog Posted by <span className="text-darkorange">{post.author.name}</span>  - Published
            at {new Date(post._createdAt).toLocaleDateString()}
            </p>       
        </div>
        <div className="mt-6">
            <PortableText
            dataset= {process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
                h1:(props:any) => (
                    <h1 className="text-2xl font-bold my-5"{...props}/>
                ),
                h2:(props:any) => (
                    <h2 className="text-xl font-bold my-5"{...props}/>
                ),
                li:({children}: any) => (
                    <li className="ml-4 list-disc">{children}</li>
                ),
                link:({href, children}: any) => (
                    <a href={href} className="text-darkorange hover:underline">{children}</a>
                ),
            }}
            />
        </div>
    </article>
    <hr className="max-w-lg my-5 mx-auto border border-darkorange" />

{submitted ? (
<div className="flex flex-col p-10 my-10 bg-darkorange text-darkblue max-w-2xl mx-auto ">
    <h3 className="text-3xl font-bold">Thank you for your comment!</h3>
    <p>You're Comment is Under Review</p>
</div>
):(
 <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto  mb-10">
        <h3 className="text-sm text-darkorange">Enjoyed the Article ?</h3>
        <h4 className="text-sm ">Leave Your Comments Below !</h4>
        <hr className="py-3 mt-2" />
        <input
        {...register("_id")}
        type="hidden"
        name="_id"
        value={post._id}
        >
        </input>
        <label className="block mb-5">
            <span>Name</span>
            <input
             {...register("name", {required:true})}
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-darkorange focus:ring outline-none" type="text" placeholder="Name" />
        </label>
         <label className="block mb-5">
            <span>Email</span>
            <input 
            {...register("email", {required:true})}
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-darkorange focus:ring outline-none"  type="text" placeholder="Name" />
        </label>
         
         <label className="block mb-5">
            <span>Comment</span>
            <textarea 
            {...register("comment", {required:true})}
            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-darkorange focus:ring outline-none" placeholder="Name" rows={8} />
        </label>

        <div className="flex flex-col p-5">
            {errors.name && (
                <span className="text-red-500">* The Name Feild is Required</span>
            )}
            {errors.email && (
                <span className="text-red-500">* The email Feild is Required</span>
            )}
            {errors.comment && (
                <span className="text-red-500">* The comment Feild is Required</span>
            )}
        </div>
        <input  type="submit" className="shadow bg-darkorange hover:bg-black hover:text-orange-500 focus:shadow-otline focus:outline-none text-black font-bold py-2
        px-4 rounded cursor-pointer" />
    </form>
) }

<div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-darkorange shadow space-y-2">
    <h3 className="text-4xl">
        Comments
    </h3>
    <hr className="pb-2"/>
    {post.comments.map((comment)=>(
<div key={comment._id}>
   <p> <span className="text-darkorange">{comment.name} : </span>{comment.comment}</p>
</div>

    ))}
</div>

   
    </div>;
}

export default Post;

export const getStaticPaths = async ()=>{
const query = `*[_type == "post"]{
  _id,
  slug{
  current
} 
}`;

const posts = await sanityClient.fetch(query);

const paths = posts.map((post:Post) =>({

params:{
    slug:post.slug.current,
},
}));

return{
    paths, 
    fallback:"blocking",
};
};

export const getStaticProps: GetStaticProps = async ({params})=>{
    const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author->{
    name,
    image
    },
    'comments':*[
        _type == "comment" && 
        post._ref == ^._id &&
        approved == true
    ],
    description,
    mainImage,
    slug,
    body
    }`;


    const post = await sanityClient.fetch(query, {
        slug:params?.slug,
    });
    if (!post){
        return{
            notFound:true,
        }
    }
    return{
        props:{
            post,
        },
        revalidate:60, //revalidate after 60seconds minute
    };
}