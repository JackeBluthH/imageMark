/**
 * 公共入口，所有的子工程都必须从这里进入
 */

import React from 'react';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

import './index.css';

const UserLayout = (props) => {
    const { children } = props;
    return (
        <div className="app-layout">
            <div className="layout-panel layout-header">
                <Header />
            </div>
            <div className="layout-panel layout-sidebar">
                <Sidebar />
            </div>
            <div className="layout-panel layout-content">
                {children}
                <Footer />
            </div>
            <div className="layout-panel layout-footer">

            </div>
        </div>
    );
};

export default UserLayout;
