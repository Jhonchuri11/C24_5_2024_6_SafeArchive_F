import React from "react";
import StudentList from "./StudentList";
import AuditLog from "./AuditLog"; 
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminAreaSidebar";
import '../../style/Admin.css';
import { useMyContext } from "../../store/ContextApi";

export default function Admin() {
    // Access the openSidebar hook using the useMyContext hook from the ContextProvider
    const { openSidebar } = useMyContext();

    return (
        <div className="d-flex">
            <AdminSidebar />
            <div
                className={`main-content transition-all overflow-hidden 
                  flex-grow-1 w-100 ${openSidebar ? "sidebar-expanded" : "sidebar-collapsed"}`}
            >
                <Routes>
                    <Route path="/" element={<Navigate to="users" replace />}/>
                    <Route path="users" element={<StudentList />} />
                    <Route path="audit-logs" element={<AuditLog />} /> 
                    <Route path="documento" element={<AuditLog />} /> 
                </Routes>
            </div>
        </div>
    );
}
