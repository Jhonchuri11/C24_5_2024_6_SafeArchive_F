import React from "react";
import { useMyContext } from "../../store/ContextApi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { LiaBlogSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import '../../style/Sidebar.css';

export default function Sidebar() {
    const { openSidebar, setOpenSidebar } = useMyContext();

    // Access the current path
    const pathName = useLocation().pathname;

    return (
        <div
            className={`sidebar-container bg-dark ${openSidebar ? "expanded" : "collapsed"}`}
        >
            <div className="d-flex justify-content-end align-items-center mb-3">
                {openSidebar ? (
                    <button
                        className="btn btn-link text-white d-flex align-items-center"
                        onClick={() => setOpenSidebar(!openSidebar)}
                    >
                        <FaArrowLeft className="me-2" />
                        <span className="fw-semibold">Close</span>
                    </button>
                ) : (
                    <Tooltip title="Click To Expand">
                        <button
                            className="btn btn-link text-white d-flex justify-content-center"
                            onClick={() => setOpenSidebar(!openSidebar)}
                        >
                            <FaArrowRight className="fs-4" />
                        </button>
                    </Tooltip>
                )}
            </div>

            {/* Reports */}
            <div className="d-flex flex-column gap-3 mt-4">
                <Tooltip title={`${openSidebar ? "" : "Usuarios"}`}>
                    <Link
                        to="/admin/users"
                        className={`d-flex align-items-center text-white py-2 px-3 rounded ${
                            pathName.startsWith("/admin/users") ? "bg-btnColor" : "bg-transparent"
                        } hover-bg-btnColor`}
                    >
                        <FaUser className="fs-4 me-2" />
                        <span className={`fw-semibold ${!openSidebar ? "d-none" : ""}`}>
                            Usuarios
                        </span>
                    </Link>
                </Tooltip>

                <Tooltip title={`${openSidebar ? "" : "Log de accesos de usuarios"}`}>
                    <Link
                        to="/admin/audit-logs"
                        className={`d-flex align-items-center text-white py-2 px-3 rounded ${
                            pathName.startsWith("/admin/audit-logs") ? "bg-btnColor" : "bg-transparent"
                        } hover-bg-btnColor`}
                    >
                        <LiaBlogSolid className="fs-4 me-2" />
                        <span className={`fw-semibold ${!openSidebar ? "d-none" : ""}`}>
                            Auditoria
                        </span>
                    </Link>
                </Tooltip>

            </div>
        </div>
    );
}
