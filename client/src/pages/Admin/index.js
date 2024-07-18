import React from 'react';
import { Tabs } from 'antd';
import MovieList from './MovieList';
import TheatresTable from './TheatresTable';

const { TabPane } = Tabs;

function Admin() {
    const tabItems = [
        {
            key: '1',
            tab: 'Movies',
            content: <MovieList />
        },
        {
            key: '2',
            tab: 'Theatres',
            content: <TheatresTable />
        }
    ];

    return (
        <div>
            <h1>Admin Page</h1>
            <Tabs defaultActiveKey="1">
                {tabItems.map(tab => (
                    <TabPane tab={tab.tab} key={tab.key}>
                        {tab.content}
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
}

export default Admin;
