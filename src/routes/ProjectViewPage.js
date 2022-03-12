import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Octokit } from "@octokit/rest";


import Header from '../components/LayoutHeader';
import OrgHeader from '../components/OrgHeader';

const styles = {
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  issueHeader: {
    marginTop: 24,
  },
};

const ProjectViewPage = (props) => {

  const { classes, match } = props;
  const { owner, projectId, viewId } = match.params;

  const [auth, setAuth] = useState(() => {
    const initialValue = localStorage.getItem("access_token");
    return initialValue || "";
  });

  const octokit = new Octokit({auth: auth});

  const [org, setOrg] = useState({});
  useEffect(() => {
    getOrg();
  }, [])

  const getOrg = async () => {
    let data = await octokit.rest.orgs.get({
      org: owner,
    }).then(res => res.data);
    setOrg(data);
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then( registration => {
        console.log('Service Worker is ready :^)', registration);
        registration.active.postMessage("Hi service worker");
      });
      window.addEventListener('load', function () {
        navigator.serviceWorker.ready.then(registration => {
          console.log('Iframe Service Worker registration successful with scope: ', registration.scope);
          const sw = registration.installing || registration.waiting || registration.active
          sw.postMessage({ code: "get-client-id" });
        }).catch(err => {
          console.log('Service Worker registration failed: ', err);
        });
      });
    }
  }, [])

  const iframe = `<iframe src="https://github.com/orgs/${owner}/projects/${projectId}/views/${viewId}" width="100%" height="450"></iframe>`;

  return (
    <>
      <Header>
        <OrgHeader org={org} />
      </Header>
      <div>
        <iframe src={`https://github.com/orgs/${owner}/projects/${projectId}/views/${viewId}`} width="100%" height="450" />
        <div dangerouslySetInnerHTML={{ __html: iframe }} />
      </div>
    </>
  );
}

ProjectViewPage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  match: PropTypes.object,
}

export default withStyles(styles)(ProjectViewPage);
