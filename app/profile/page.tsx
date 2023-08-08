'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Profile } from '@/components'

const MyProfile = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const [posts, setPosts] = useState([])

  const handleEdit = (post: any) => {
    router.push(`/update-post?id=${post._id}`)
  }

  const handleDelete = async (post: any) => {
    const hasConfirmed = confirm('Are you sure you want to delete this post?')

    if (hasConfirmed) {
      try {
        await fetch(`/api/post/${post._id.toString()}`, {
          method: 'DELETE',
        })

        const filteredPosts = posts.filter((p: any) => p._id !== post._id)

        setPosts(filteredPosts)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user?.id}/posts`)
      const data = await response.json()

      setPosts(data)
    }
    if (session?.user?.id) fetchPosts()
  }, [])

  return (
    <Profile
      name='My'
      desc='Welcome to your personalised profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile
