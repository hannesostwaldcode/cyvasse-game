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
import { LessonDisplay } from './components/learn/LessonDisplay.tsx'
import { CourseOverview } from './components/CourseOverview.tsx'
import { CourseDetail } from './components/CourseDetail.tsx'
import { Social } from './pages/Social.tsx'


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
            path: "social",
            element: <Social/>,
          },
          {
            path: "playgame/:gameId",
            element: <PlayArea/>,
          },
          {
            path: "learn",
            element: <Learn/>,
            children: [
              {
                index: true,
                element: <CourseOverview/>,  
              },
              {
                path: ":courseId",
                element: <CourseDetail/>,  
              },
              {
                path: ":courseId/:lessonId",
                element: <LessonDisplay/>,  
              }
            ]  
          },
          
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
