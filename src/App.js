import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Store } from "./states/store";

import { AdminProtectedRoute, UnprotectedRoute } from "./routes";
import { Header, Footer, SideNavBar, NotFound } from "./components";
import {
  Dashboard, AdminLoginScreen, ViewProfile,
  UserTable, AddUser, ViewUser,
  ManagerTable, AddManager, ViewManager,
  ControllerTable, AddController, ViewController,
  WarehouseTable, AddWarehouse, ViewWarehouse,
  TransactionTable, AddTransaction, ViewTransaction,
  InvoiceTable, AddInvoice, ViewInvoice,
  OrderTable, AddOrder, ViewOrder,
  Content, AddContent, ViewContent
} from "./pages";

function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/admin/dashboard", comp: <Dashboard /> },
    { path: "/view-profile", comp: <ViewProfile /> },
    { path: "/admin/users", comp: <UserTable /> },
    { path: "/admin/user/create", comp: <AddUser /> },
    { path: "/admin/view/user/:id", comp: <ViewUser /> },
    { path: "/admin/managers", comp: <ManagerTable /> },
    { path: "/admin/manager/create", comp: <AddManager /> },
    { path: "/admin/view/manager/:id", comp: <ViewManager /> },
    { path: "/admin/controllers", comp: <ControllerTable /> },
    { path: "/admin/controller/create", comp: <AddController /> },
    { path: "/admin/view/controller/:id", comp: <ViewController /> },
    { path: "/admin/warehouses", comp: <WarehouseTable /> },
    { path: "/admin/warehouse/create", comp: <AddWarehouse /> },
    { path: "/admin/view/warehouse/:id", comp: <ViewWarehouse /> },
    { path: "/admin/transactions", comp: <TransactionTable /> },
    { path: "/admin/transaction/create", comp: <AddTransaction /> },
    { path: "/admin/view/transaction/:id", comp: <ViewTransaction /> },
    { path: "/admin/invoices", comp: <InvoiceTable /> },
    { path: "/admin/invoice/create", comp: <AddInvoice /> },
    { path: "/admin/view/invoice/:id", comp: <ViewInvoice /> },
    { path: "/admin/orders", comp: <OrderTable /> },
    { path: "/admin/order/create", comp: <AddOrder /> },
    { path: "/admin/view/order/:id", comp: <ViewOrder /> },
    { path: "/admin/contents", comp: <Content /> },
    { path: "/admin/content/create", comp: <AddContent /> },
    { path: "/admin/view/content/:id", comp: <ViewContent /> },

  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        <SideNavBar isExpanded={isExpanded} />
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"} 
        ${token ? "" : "m-0"} d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />

          {routeList.map(({ path, comp }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{comp}</AdminProtectedRoute>}
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
