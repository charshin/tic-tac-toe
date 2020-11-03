import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';

import Main from '$app/modules/main';

import './styles';

const App = () => (
  <Switch>
    <Route component={Main} />
  </Switch>
);

export default hot(module)(App);
