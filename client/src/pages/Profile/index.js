import { Tabs } from 'antd';
import Bookings from './Bookings';

const Profile = () => {
    const items = [
        {
            key: '1',
            tab: 'Bookings',
            content: <Bookings />,
        },
        
    ];

    return (
        <>
            <h1>User Profile Page</h1>
            <Tabs defaultActiveKey="1">
                {items.map(item => (
                    <Tabs.TabPane tab={item.tab} key={item.key}>
                        {item.content}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </>
    );
}

export default Profile;
