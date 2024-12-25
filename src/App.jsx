import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Base from "./components/common/Base"
import Dashboard from "./pages/dashboard/Dashboard"
import Banners from "./pages/banners/Banners"
import AddBanners from "./pages/banners/AddBanners"
import { QueryClient, QueryClientProvider } from 'react-query'
import Category from "./pages/category/Category"
import AddCategory from "./pages/category/AddCategory"
import Product from "./pages/products/Product"
import AddProduct from "./pages/products/AddProduct"
import Brand from "./pages/brands/Brand"
import AddBrand from "./pages/brands/AddBrand"
import Shipping from "./pages/shipping/Shipping"
import AddShipping from "./pages/shipping/AddShipping"
import Order from "./pages/orders/Order"
import Post from "./pages/posts/Post"
import AddPost from "./pages/posts/AddPost"
import Tags from "./pages/tags/Tags"
import AddTag from "./pages/tags/AddTag"
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const router = createBrowserRouter([{
	path: "/",
	element: <Base />,
	children: [
		{ path: "", element: <Dashboard />,  },
		{ path: 'banner', element: <Banners /> },
		{ path: 'banner/add', element: <AddBanners /> },
		{ path: 'category', element: <Category /> },
		{ path: 'category/add', element: <AddCategory /> },
		{ path: 'product', element: <Product /> },
		{ path: 'product/add', element: <AddProduct /> },
		{ path: 'brand', element: <Brand /> },
		{ path: 'brand/add', element: <AddBrand /> },
		{ path: 'shipping', element: <Shipping /> },
		{ path: 'shipping/add', element: <AddShipping /> },
		{ path: 'orders', element: <Order /> },
		{ path: 'post', element: <Post /> },
		{ path: 'post/add', element: <AddPost /> },
		{ path: 'tag', element: <Tags /> },
		{ path: 'tag/add', element: <AddTag /> },
	],
}])

function App() {

	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{/* <ReactQueryDevtools /> */}
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default App
