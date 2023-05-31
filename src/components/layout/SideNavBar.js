import "./SideNavBar.css";
import React, { useContext, useState } from "react";
import { Store } from "../../states/store";
import { Link, useNavigate } from "react-router-dom";
import { RiDashboard2Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import {
  MdWarehouse,
  MdOutlineContentPaste,
  MdOutlineSwapHoriz,
  MdManageAccounts,
} from "react-icons/md";
import {
  FaFileInvoiceDollar,
  FaShoppingBasket,
  FaSignOutAlt,
  FaUserPlus
} from "react-icons/fa";
import {GrUserManager} from 'react-icons/gr';

const linkList = [
  {
    icon: <RiDashboard2Fill className="icon-md" />,
    text: "Dashboard",
    url: "/admin/dashboard",
  },
  { icon: <HiUsers className="icon-md" />, text: "Users", url: "/admin/users" },
  { icon: <MdManageAccounts className="icon-md" />, text: "Managers", url: "/admin/managers" },
  { icon: <FaUserPlus className="icon-md" />, text: "Controllers", url: "/admin/controllers" },
  {
    icon: <MdWarehouse className="icon-md" />,
    text: "Warehouse",
    url: "/admin/warehouses",
  },
  {
    icon: <MdOutlineSwapHoriz className="icon-md" />,
    text: "Transaction",
    url: "/admin/transactions",
  },
  {
    icon: <FaFileInvoiceDollar className="icon-md" />,
    text: "Invoice",
    url: "/admin/invoices",
  },
  {
    icon: <FaShoppingBasket className="icon-md" />,
    text: "Orders",
    url: "/admin/orders",
  },
  {
    icon: <MdOutlineContentPaste className="icon-md" />,
    text: "Contents",
    url: "/admin/contents",
  },
];

const active_text = {
  Dashboard: "dashboard",
  Users: "user",
  Managers: "manager",
  Controllers: "controller",
  Warehouse: "warehouse",
  Transaction: "transaction",
  Invoice: "invoice",
  Orders: "order",
  Contents: "content",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.pathname;
  const [activeLink, setActiveLink] = useState('Dashboard');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const activeLinkHandler = (text) => {
    // console.log("text", active_text[text]);
    // console.log(pathname.includes(active_text[text]));
    return pathname.includes(active_text[text]);
  };

  const cls = `nav-item has-treeview ${
    isExpanded ? "menu-item" : "menu-item menu-item-NX"
  }`;

  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="brand-link">
            <img src="/favicon.ico" alt="" width={"50px"} height="auto" />
            <span className="brand-text ms-2 font-weight-light">
              Evelyne
            </span>
          </div>

          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <Link to="/view-profile" className="d-block">
                  {userInfo.avatar && (
                    <img
                      src={userInfo.avatar}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  <span className="info-text">
                    Welcome{" "}
                    {userInfo
                      ? `${userInfo.fullname}`
                      : "Back"}
                  </span>
                </Link>
              </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {linkList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`${cls} ${
                      activeLinkHandler(text) && "active-item"
                    }`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                <li className={cls}>
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
