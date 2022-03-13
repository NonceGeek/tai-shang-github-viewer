import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Octokit } from '@octokit/rest';
import { useSelector } from 'react-redux';

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

const IssueListFilter = ({ classes, state, onChange, name, owner, q, ...otherProps }) => {

  const [auth, setAuth] = useState(() => {
    const initialValue = localStorage.getItem("access_token");
    return initialValue || "";
  });
  let issueCount = useSelector(state => state.issueCount);
  let issueOpenCount = useSelector(state => state.issueOpenCount);
  let issueClosedCount = useSelector(state => state.issueClosedCount);

  return (
    <Tabs
      value={state}
      onChange={onChange}
      indicatorColor="primary"
      {...otherProps}
    >
      <Tab
        value="OPEN"
        label={issueOpenCount ? `${issueOpenCount} OPEN` : 'OPEN'}
      />
      <Tab
        value="CLOSED"
        label={issueClosedCount ? `${issueClosedCount} CLOSED` : 'CLOSED'}
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
