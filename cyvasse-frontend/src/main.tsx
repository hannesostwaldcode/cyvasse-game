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
import { PlayArea } from './pages/PlayArea.tsx'
import { Dashboard } from './pages/Dashboard.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { Home } from './pages/Home.tsx'
import { Learn } from './pages/Learn.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
          {
            path: "",
            element: <Home/>
          },
          {
            path: "creategame",
            element: <ProtectedRoute><CreateGame /></ProtectedRoute> ,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "playgame/:gameId",
            element: <PlayArea/>,
          },
          {
            path: "learn",
            element: <Learn/>,
          }
      ]
},
])

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>

    </QueryClientProvider>
  </React.StrictMode>,
)
