import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import IssuePage from './IssuePage';
import ProjectViewPage from './ProjectViewPage';
import OrgIssuePage from './OrgIssuePage';
import OrgPage from './OrgPage';
import RepoPage from './RepoPage';
import NotFoundPage from './NotFoundPage';

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/WeLightProject" />
    </Route>
    {/* <Route path="/" exact component={SearchPage} /> */}
    {/* <Route path="/search" component={SearchPage} /> */}
    <Route path="/:owner" exact component={OrgPage} />
    <Route path="/:owner/issues" exact component={OrgIssuePage} />
    <Route path="/:owner/:name" exact component={RepoPage} />
    <Route path="/:owner/:name/issues/:number" exact component={IssuePage} />
    {/* <Route path="/:owner/projects/:projectId/views/:viewId" exact component={() => {
      // window.location.href = 'https://github.com/orgs/WeLightProject/projects/4/views/1';
      // return null;
      window.open(
        'https://github.com/orgs/WeLightProject/projects/4/views/1',
        '_blank'
      );
    }} /> */}
    <Route component={NotFoundPage} />
  </Switch>
);

Routes.propTypes = {};

export default Routes;
