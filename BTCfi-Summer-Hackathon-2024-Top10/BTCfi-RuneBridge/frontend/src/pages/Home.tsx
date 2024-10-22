import { Col, Tabs } from "antd";
import BitcoinToCore from "../components/BitcoinToCore/BitcoinToCore";
import CoreToBitcoin from "../components/CoreToBitcoin";

export const Home = () => {
    return (
        <Col
            style={{ marginTop: 40 }}
            xxl={{ span: 15, offset: 3 }}
            xl={{ span: 18, offset: 3 }}
            lg={{ span: 18, offset: 3 }}
            md={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            xs={{ span: 24, offset: 0 }}
        >
            <Tabs
                defaultActiveKey="bitcoinToCore"
                items={[
                    {
                        key: 'bitcoinToCore',
                        label: 'Bitcoin -> Core',
                        children: <BitcoinToCore />,
                    },
                    {
                        key: 'coreToBitcoin',
                        label: 'Core -> Bitcoin',
                        children: <CoreToBitcoin />,
                    },
                ]}
            />
            
        </Col>
    );
};
