import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Octokit } from '@octokit/rest';

import { withSkeletonProvider } from './Skeleton';

// const ISSUES_COUNT_QUERY = gql`
// query IssuesCount($owner: String!, $name: String!) {
//   repository(owner: $owner, name: $name) {
//     openedCount: issues(states: [OPEN]) {
//       totalCount
//     }
//     closedCount: issues(states: [CLOSED]) {
//       totalCount
//     }
//   }
// }
// `;

const IssueListFilter = ({ classes, state, onChange, name, owner, q,...otherProps }) => {

  const [auth, setAuth] = useState(() => {
    const initialValue = localStorage.getItem("access_token");
    return initialValue || "";
  });

  const octokit = new Octokit({auth: auth});
  const [openedCount, setOpenedCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      let openQ = `${q}+repo:${owner}/${name}+type:issue+state:open`
      if (name === '') {
        openQ = `${q}+org:${owner}+type:issue+state:open`
      }

      let openData = await octokit.rest.search.issuesAndPullRequests({
        q: openQ,
        per_page: 1
      }).then(res => res.data);
      setOpenedCount(openData.total_count);

      let closedQ = `${q}+repo:${owner}/${name}+type:issue+state:closed`
      if (name === '') {
        closedQ = `${q}+org:${owner}+type:issue+state:closed`
      }
      let closedData = await octokit.rest.search.issuesAndPullRequests({
        q: closedQ,
        per_page: 1
      }).then(res => res.data);
      setClosedCount(closedData.total_count);
    }
    getData();
  }, [q])

  return (
    <Tabs
      value={state}
      onChange={onChange}
      indicatorColor="primary"
      {...otherProps}
    >
      <Tab
        value="OPEN"
        label={openedCount ? `${openedCount} OPEN` : 'OPEN'}
      />
      <Tab
        value="CLOSED"
        label={closedCount ? `${closedCount} CLOSED` : 'CLOSED'}
      />
    </Tabs>
  );
};

IssueListFilter.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  state: PropTypes.string,
  q: PropTypes.string,
  loading: PropTypes.bool,
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
};

IssueListFilter.defaultProps = {
  q: '',
};

export default withSkeletonProvider()(IssueListFilter);
