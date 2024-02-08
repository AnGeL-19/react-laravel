import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const URL = 'https://jsonplaceholder.typicode.com/posts';

const fetchAData = async () => {

  const response = await fetch(URL);
  const json = await response.json();

  return json;

}

export const fetchCreatePost = async ( data) => {

    const response = await fetch(URL, 
    {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })

    return await response.json();
    
}

export const fetchModifyPost = async (data) => {

    const response = await fetch(`${URL}/${data.id}`, 
    {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })

    const dataJson = await response.json();
    
    return dataJson;


}

export const fetchDeletePost = async (data) => {

    const response = await fetch(`${URL}/${data.id}`, {
        method: 'DELETE'
    });
    
    const dataDelete = await response.json();

    return dataDelete;
}


export const useFetchPost = () => {

    const [error, setError] = useState('')
    const queryClient = useQueryClient()

    // Queries
    const query = useQuery({ queryKey: ['posts'], queryFn: fetchAData })

        // Mutations
        const mutationAddPost = useMutation({
            mutationFn: fetchCreatePost,
            onSuccess: (data) => {
                // Invalidate and refetch
                // queryClient.invalidateQueries({ queryKey: ['posts'] })
                console.log(data, 'success');
              
                queryClient.setQueryData(['posts'], (old) => [data, ...old])
                setError('')
    
            },
            onError: (error) => {
                console.log(error, 'error');
                setError('Error al crear un post ' + error)
            }
        })
    
        const mutationModPost = useMutation({
          mutationFn: fetchModifyPost,
          onSuccess: (data) => {
              console.log(data, 'success mod');
              
              queryClient.setQueryData(['posts'], (old) => {
    
                const indexMod = old.findIndex( p => p.id === data.id );
                old[indexMod] = data;
    
                return old
              })
    
          },
          onError: (error) => {
              console.log(error, 'error');
              setError('Error al modificar un post ' + error)
          }
      })
    
      const mutationDelPost = useMutation({
        mutationFn: fetchDeletePost,
        onSuccess: (data, variable, context) => {
            console.log(data, variable, context,'success mod');
            
            queryClient.setQueryData(['posts'], (old) => {
    
              const deletePost = old.filter( p => p.id !== variable.id );
      
              return deletePost
    
            })
    
        },
        onError: (error) => {
            console.log(error, 'error');
            setError('Error al eliminar un post ' + error)
        }
    })


    return {
        query,
        error,
        mutationAddPost,
        mutationModPost,
        mutationDelPost
    }

}