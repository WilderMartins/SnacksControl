import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from './services/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Kiosk from './pages/Kiosk';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Categories from './pages/Categories';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Layout>
          <Component {...props} />
        </Layout>
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/users" component={Users} />
      <PrivateRoute path="/products" component={Products} />
      <PrivateRoute path="/kiosk" component={Kiosk} />
      <PrivateRoute path="/reports" component={Reports} />
      <PrivateRoute path="/settings" component={Settings} />
      <PrivateRoute path="/categories" component={Categories} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
