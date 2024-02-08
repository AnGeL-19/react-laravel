/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import './bootstrap';
import '../sass/app.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Example } from './components/Example';
import { PostPage } from './page/PostPage';
import { PostQueryPage } from './page/PostQueryPage';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'


const queryClient = new QueryClient()

export const App = () => {
    return (
        <>
            {/* <PostPage /> */}
            <QueryClientProvider client={queryClient}>
                <PostQueryPage />
            </QueryClientProvider>
        </>
    )
}

createRoot(document.getElementById('root')).render(<App/>)

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


