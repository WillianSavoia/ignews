import {  GetStaticPaths, GetStaticProps } from "next"

import { createClient } from "../../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"

import styles from '../post.module.scss'
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface Post {
   
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
}

interface PostPreviewProps{
    post: Post
}

export default function PostPreview({post}: PostPreviewProps) {

    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session])
    return (
        <>
        <Head>
            <title>{post.title} | Ignews</title>
        </Head>

        <main className={styles.container}>
            <article className={styles.post}>
              <h1>{post.title}</h1>
              <time>{post.updatedAt}</time>
              <div className={`${styles.postContent} ${styles.previewContent}`}
               dangerouslySetInnerHTML={{__html: post.content.slice(0,979)}}/> 

               <div className={styles.continueReading}>
                Wanna Continue Reading?
                <Link href="/">
                <a href="">Subscribe now 🤗</a>
                </Link>
               </div>
            </article>
        </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths= async () =>{
    return{
       paths: [],
       fallback: 'blocking'
    }
    }


export const getStaticProps: GetStaticProps = async ({ params, previewData }) =>{
  
   const {slug} = params;


   const prismic = createClient({previewData})

   const response = await prismic.getByUID('post', String(slug), {})



   const post = {
    slug,
    title: prismicH.asText(response.data.tittle),
    content: prismicH.asHTML(response.data.content), 
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
   }

   return {
    props: {
        post
    },
    redirect: 60 * 30, 
   } 
}

