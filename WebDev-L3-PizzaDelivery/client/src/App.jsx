import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import Layout from "./component/common/Layout"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
