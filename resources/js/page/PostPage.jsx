import { reject } from 'lodash';
import React, { useEffect, useState } from 'react'

const URL = 'https://jsonplaceholder.typicode.com/posts';
const fetchAData = async () => {

  const response = await fetch(URL);
  const json = await response.json();

  return json;

}

const fetchDelete = async (data) => {

    const response = await fetch(`${URL}/${data.id}`, {
        method: 'DELETE'
    });
    
    const dataDelete = await response.json();

    return dataDelete;
}

const fetchTruncate = async ( method, data) => {

    const response = await fetch(`${URL}${(method === 'PUT' || method === 'PATCH') ? `/${data.id}`: '' }`, 
    {
        method,
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })

    const dataJson = await response.json();
    
    return dataJson;


}

export const PostPage = () => {

  const [isLoading  , setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [posts, setPosts] = useState([])
  const [postSelected, setPostSelected] = useState({
    userId: null,
    id: null,
    title: "",
    body: "",
  })


  useEffect(() => {

    fetchAData()
    .then((response) => setPosts(response))
    .finally( () => setIsLoading(false) )
    return () => {

    }
  }, [])

  const handleEdit = (post) => {
    setPostSelected(post)


  }

  const handleDeletePost = (post) => {


    fetchDelete(post)
    .then((response) => {
        //setPosts( postModified )
        console.log( response );
        const deletePost = posts.filter(p => p.id !== post.id);
        setPosts(deletePost)
        setError('')
    })
    .catch((error) => setError('Error al eliminar posts' + error.message))

  }

  const handleSubmitModifyPost = (e) => {
    e.preventDefault()


    console.log('modify', postSelected);

    fetchTruncate('PATCH', postSelected)
    .then((response) => {

        const postModified = posts.map( p => {
            if (response.id === p.id) {
                return response
            }
            return p;
        })

        setPosts( postModified )
        console.log(response);
        setError('')
    })
    .catch((error) => setError('Error al modificar posts ' + error.message))

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
    const newPost = {
      userId: new Date().getMilliseconds(),
      id: new Date().getMilliseconds() + 1,
      ...rest
    }

    // 
    fetchTruncate('POST',newPost)
    .then((response) => {
        setPosts( prev => [response, ...prev])
        setError('')
    })
    .catch((error) => setError('Error al agregar nuevo posts ' + error.message))

    setPostSelected({
      userId: null,
      id: null,
      title: "",
      body: "",
    })
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
            (error.length !== 0)
            ? <div className='w-100 alert alert-danger'>{error}</div>
            : 
            <ul className='d-flex flex-column gap-3'>
                {
                    isLoading
                    ? <span>Loading...</span>
                    : posts.map( (post) => (
                    <li key={post.id} className="card p-2">
                        <div>
                        <span className="card-title">{post.title}</span>
                        <p className="card-body">{post.body}</p>
                        </div>

                        <div>
                        <button className='btn btn-warning me-1' onClick={() => handleEdit(post)}>Modificar</button>
                        <button className='btn btn-danger' onClick={() => handleDeletePost(post)}>Eliminar</button>
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