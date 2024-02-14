import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { 
  QueryClient, QueryClientProvider
 } from '@tanstack/react-query'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import './index.css'
import { CreateGame } from './pages/CreateGame.tsx'
import { PlayArea } from './layouts/PlayArea.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,

  },

  {
    path: "/creategame",
    element: <CreateGame/>,
  },
  {
    path: "/playgame/:gameId/:playerId",
    element: <PlayArea/>,
  },
])

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <div className="flex flex-row bg-zinc-100">
    <div className="w-1/6 p-3">
      <h1 className="text-3xl font-bold text-slate-700 h-screen">Cyvasse</h1>
      
    </div>
    <RouterProvider router={router}/>
    </div>
     
    </QueryClientProvider>
  </React.StrictMode>,
)
