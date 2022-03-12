import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';

import IssueListItem from './IssueListItem';
import { IssueState } from '../constants';
import IssuesLoader from './IssuesLoader';
import Pagination from './Pagination';
import Message from './Message';


const Loading = () => (
  <List>
    <IssueListItem loading />
    <IssueListItem loading />
    <IssueListItem loading />
    <IssueListItem loading />
  </List>
);

const EmptyState = () => (
  <Message
    title="There is no issues here"
    description="Looks like not everybody has issues after all."
  />
);

const IssueList = (props) => {

  const { owner, name, state, q } = props;
  return (
    <IssuesLoader
      owner={owner}
      name={name}
      state={state}
      q={q}
    >
      {({ loading, issues, page, hasNextPage, onLoadNext, onLoadPrevious, hasPreviousPage }) => {
        if (loading) return <Loading />;
        else if (!issues.length) {
          return <EmptyState />;
        }
        return (
          <div>
            <List>
              {issues.map(issue => (
                <Link key={issue.id} to={`/${owner}/${name}/issues/${issue.number}`}>
                  <IssueListItem
                    number={issue.number}
                    title={issue.title}
                    author={issue.user ? issue.user.login : undefined}
                    createdAt={issue.created_at}
                    commentCount={issue.comments}
                    state={issue.state === "open" ? IssueState.OPEN : IssueState.CLOSED}
                    tabIndex={-1}
                    labels={issue.labels}
                  />
                </Link>
              ))}
            </List>
            <Pagination
              page={page}
              onLoadNext={onLoadNext}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onLoadPrevious={onLoadPrevious}
            />
          </div>
        );
      }}
    </IssuesLoader>
  );
}

IssueList.propTypes = {
  owner: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  state: PropTypes.string,
  q: PropTypes.string,
};

IssueList.defaultProps = {
  state: IssueState.OPEN,
  q: '',
}

export default IssueList;
