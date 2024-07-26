
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import HomePage from './routes/HomePage/HomePage'
import ListPage from './routes/listpage/ListPage'
import {Layout} from './routes/layout/Layout'
import {RequireAuth} from './routes/layout/Layout'
import SinglePage from './routes/singlepage/SinglePage'
import LoginPage from './routes/login/LoginPage'
import Profile from './routes/profilepage/Profile'
import Register from './routes/register/Register'
import ProfileUpdate from './routes/ProfileUpdate/ProfileUpdate'
import NewPost from './routes/newPost/NewPost'
import Edit from './routes/Edit/Edit'
import {listPageLoader, singlePageLoader,profilePageLoader,EditPageLoader} from './lib/loaders'
function App() {
  

const router=createBrowserRouter(


  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/list' element={<ListPage/>} loader={listPageLoader}/>
      <Route path='/:id' element={<SinglePage/>} loader={singlePageLoader}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/profile' element={<Profile/>} loader={profilePageLoader}/>
      <Route path='/profile/update' element={<ProfileUpdate/>}/>
      <Route path='/addPost' element={<NewPost/>}/>
      <Route path='/edit/:id' element={<Edit />} loader={EditPageLoader} />

      
    </Route>


  ),

  {
    path:'/',
    element:<RequireAuth/>,
    children:[
      {
path:'/profile',
element:<Profile/>,
loader:profilePageLoader,
      },
      {
        path:'/profile/update',
        element:<ProfileUpdate/>,
              },
              {
                path:'/addPost',
                element:<NewPost/>,
                      },
                      {
                        path:'/edit/:id',
                        element:<Edit/>,
                        loader:EditPageLoader,
                              }
    ]
  }
)

  return (
    
     

      <RouterProvider router={router}/>
    
  )
}

export default App
