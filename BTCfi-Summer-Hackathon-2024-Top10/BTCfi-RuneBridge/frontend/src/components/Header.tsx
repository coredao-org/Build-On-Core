import { Layout, Menu, Row, Col, Button, Grid } from 'antd';
import logo from '../assets/runebridge.svg';
import { Link } from 'react-router-dom';
import { RoutesEnum } from '../core/routes.enum';
import { MenuOutlined } from '@ant-design/icons';
import { useWeb3 } from '../providers/Web3Provider';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

export const Header = () => {
    const { address, connect, disconnect } = useWeb3();
    const screens = useBreakpoint();

    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

    return (
        <AntHeader style={{ background: '#141414', padding: 0 }}>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} md={12} lg={10} xl={8}>
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ height: 60, borderBottom: 0 }} overflowedIndicator={<MenuOutlined />}>
                        <Link to={RoutesEnum.Home} style={{ paddingTop: 10, paddingBottom: -10 }}>
                            <img src={logo} alt="Logo" style={{ height: '40px', marginTop: '2px', marginRight: '25px' }} />
                        </Link>
                        {screens.lg && (
                            <>
                                <Menu.Item key="1">
                                    <Link to={RoutesEnum.Home}>Home</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to={RoutesEnum.FAQ}>FAQ</Link>
                                </Menu.Item>
                            </>
                        )}
                    </Menu>
                </Col>
                <Col xs={4} sm={8} md={6} lg={4} xl={4} style={{ textAlign: 'right' }}>
                    {address ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: screens.xs ? 'flex-end' : 'center' }}>
                            <span style={{ color: '#fff', marginRight: '10px' }}>{shortAddress}</span>
                            <Button type="primary" onClick={disconnect}>
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: screens.xs ? 'flex-end' : 'center' }}>
                            <Button type="primary" onClick={connect}>Connect Wallet</Button>
                        </div>
                    )}
                </Col>
            </Row>
        </AntHeader>
    );
};
