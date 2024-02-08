
import React, {  useState } from 'react'
import { useFetchPost } from '../hook/useFetchPost';


export const PostQueryPage = () => {

    const [postSelected, setPostSelected] = useState({
        userId: null,
        id: null,
        title: "",
        body: "",
    })

    const { query, mutationAddPost, mutationModPost, mutationDelPost, error } = useFetchPost()

    const handleEdit = (post) => {
        setPostSelected(post)
    }

    const handleSubmitModifyPost = (e) => {
        e.preventDefault()

        mutationModPost.mutate(postSelected)

        setPostSelected({
          userId: null,
          id: null,
          title: "",
          body: "",
        })

    }

    const handleSubmitAddPost = (e) => {
        e.preventDefault()

        const { userId, id, ...rest } = postSelected

        mutationAddPost.mutate({
            userId: new Date().getMilliseconds(),
            id: new Date().getMilliseconds() + 1,
            ...rest
        })

        setPostSelected({
        userId: null,
        id: null,
        title: "",
        body: "",
        })
    }

    const handleSubmitDelPost = (e, post) => {
      e.preventDefault()

      mutationDelPost.mutate(post)


  }

  const handleOnChange = (e) => {

    setPostSelected( prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))

  }


  return (
    <div>

      <h1 className='text-center'>POSTS</h1>
      <section className='w-100 d-flex gap-5'>

        {
            (query.error || error)
            ? <div className='w-100 alert alert-danger'>{ query.error.message || error }</div>
            : 
            <ul className='d-flex flex-column gap-3'>
                {
                    query.isLoading
                    ? <span>Loading...</span>
                    : query.data.map( (post) => (
                    <li key={post.id} className="card p-2">
                        <div>
                            <span className="card-title">{post.title}</span>
                            <p className="card-body">{post.body}</p>
                        </div>
                        <div>
                        <button className='btn btn-warning me-1' onClick={() => handleEdit(post)}  disabled={query.isFetching}>Modificar</button>
                        <button className='btn btn-danger' onClick={(e) => handleSubmitDelPost(e,post)}  disabled={query.isFetching}>Eliminar</button>
                        </div>

                    </li>
                    ))
                }
            </ul>
        }
        
        
        <div>
          <span>POST</span>

          {
                  postSelected
                  &&
                  <form
                    className='form-control d-flex flex-column gap-1'
                    onSubmit={
                      postSelected.id
                      ? handleSubmitModifyPost
                      : handleSubmitAddPost
                    } >
                    <input type="text"
                    name="title"
                    value={postSelected.title || ''}
                    onChange={handleOnChange}
                    placeholder="Title" />

                    <input 
                    type="text"
                    name="body"
                    value={postSelected.body || ''}
                    onChange={handleOnChange}
                    placeholder="Description" />
                    <button className='btn btn-dark'>
                      {
                        postSelected.id
                        ? 'Modificar'
                        : 'Agregar'
                      }
                    </button>
                  </form>
                }
        </div>
      </section>


    </div>
  )


}