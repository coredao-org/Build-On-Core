import { Col, ConfigProvider, Layout, Row, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { RoutesEnum } from './core/routes.enum'
import { FAQ, Home } from './pages'
import { Web3Provider } from './providers/Web3Provider'
import { ClientProvider } from './providers/ClientProvider'

const appTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: 'Open Sans',
    colorPrimary: '#f7931a',
  }
}

function App() {
  return (
    <ClientProvider>
      <Web3Provider>
        <ConfigProvider theme={appTheme}>
          <BrowserRouter>
            <Layout style={{ padding: 0, minHeight: '100vh' }}>
              <Header />
              <Content>
                <Row justify="center">
                <Col xxl={12} xl={18} lg={20} md={24} sm={24} xs={24} style={{ padding: 15}}>
                    <Routes>
                      <Route path={RoutesEnum.Home} element={<Home />} />
                      <Route path={RoutesEnum.FAQ} element={<FAQ />} />
                    </Routes>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </BrowserRouter>
        </ConfigProvider>
      </Web3Provider>
    </ClientProvider>
  )
}

export default App
