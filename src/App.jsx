import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Base from "./components/common/Base"
import Dashboard from "./pages/dashboard/Dashboard"


const router = createBrowserRouter([{
	path: "/",
	element: <Base />,
	children: [
		{
			path: "",
      		element: <Dashboard />, 
		},
	],
}])

function App() {

	return (
		<RouterProvider router={router} />
	)
}

export default App
