import React from 'react';
import { Tabs } from 'antd';
import TheatreList from './TheatreList';

const { TabPane } = Tabs;

const Partner = () => {
  const items = [
    {
      key: '1',
      tab: 'Theatres',
      content: <TheatreList />,
    },
  ];

  return (
    <div>
      <h1>Partner Page</h1>
      <Tabs defaultActiveKey="1">
        {items.map(item => (
          <TabPane tab={item.tab} key={item.key}>
            {item.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Partner;
