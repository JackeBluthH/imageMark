/**
 * 公共入口，所有的子工程都必须从这里进入
 */

import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

// import styles from './index.less';
// import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
// import { useIntl, connect } from 'umi';

import './index.css';

const UserLayout = (props) => {
    // const {
    //     route = {
    //         routes: [],
    //     },
    // } = props;
    // const { routes = [] } = route;
    const { children, title="Image Mark" } = props;
    // const { formatMessage } = useIntl();
    // const { breadcrumb } = getMenuData(routes);
    // const title = getPageTitle({
    //     pathname: location.pathname,
    //     formatMessage,
    //     breadcrumb,
    //     ...props,
    // });
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={title} />
            </Helmet>
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
        </HelmetProvider>
    );
};

export default UserLayout;
