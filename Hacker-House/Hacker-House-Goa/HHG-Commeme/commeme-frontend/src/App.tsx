
import './App.css'
import {  Route, Switch } from "wouter";
import MemeDiv from './components/meme-template';
import Hero from './components/hero';

import Anon from './components/anon-aadhar';

import Explore from './components/explore-polygon';
import ExploreCore from './components/explore-coredao';



function App() {

  return (
    <>
    {/* 
      Routes below are matched exclusively -
      the first matched route gets rendered
    */}
    <Switch>
      <Route path='/' component={Hero} />
      <Route path="/meme-template" component={MemeDiv} />
      <Route path="/anon" component={Anon} />

      <Route path="/users/:name">
        {(params) => <>Hello, {params.name}!</>}
      </Route>
      <Route path="/explore/137" component={Explore}/>
      <Route path="/explore/1116" component={ExploreCore}/>
        {/* <Route path="/explore/:chainId">
        {(params) => <Explore chainId={parseInt(params.chainId)} />}
        </Route> */}
      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
  </>
  )
}

export default App
