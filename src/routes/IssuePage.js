import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Octokit } from '@octokit/rest';

import Header from '../components/LayoutHeader';
import Content from '../components/LayoutContent';
import IssueHeader from '../components/IssueHeader';
import IssueComment from '../components/IssueComment';
import IssueCommentList from '../components/IssueCommentList';
import MessageError from '../components/MessageError';

const styles = {
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  issueHeader: {
    marginTop: 24,
  },
};

// const ISSUE_QUERY = gql`
//   query IssueQuery($owner: String!, $name: String!, $number: Int!) {
//     repository(owner: $owner, name: $name) {
//       issue(number: $number) {
//         id
//         number
//         title
//         author { login, avatarUrl }
//         createdAt
//         comments { totalCount }
//         state
//         body
//         url
//       }
//     }
//   }
// `;

const Issue = (props) => {

  const { classes, match } = props;
  const { owner, name } = match.params;
  const issueNumber = Number(match.params.number);

  const octokit = new Octokit({});
  const [issue, setIssue] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      let data = await octokit.rest.issues.get({
        owner,
        repo: name,
        issue_number: issueNumber,
      }).then(res => res.data);
      setLoading(false);
      setIssue(data);
    }
    getData();
  }, [])

  // if (error) return <MessageError />;

  return (
    <>
      <Header>
        <div className={classes.breadcrumb}>
          <Typography variant="h6"><Link to={`/${owner}`}>{owner}</Link> / <Link to={`/${owner}/${name}`}>{name}</Link></Typography>
        </div>
        <IssueHeader
          className={classes.issueHeader}
          loading={loading}
          title={issue.title}
          number={issue.number}
          createdAt={issue.created_at}
          state={issue.state === "open" ? "OPEN" : "CLOSED"}
          author={issue.user ? issue.user.login : null}
          commentsCount={issue.comments}
          url={issue.html_url}
        />
      </Header>
      <Content>
        <IssueComment
          loading={loading}
          author={issue.user}
          body={issue.body}
          createdAt={issue.created_at}
        />
        {!loading && (
          <IssueCommentList
            owner={owner}
            name={name}
            number={issueNumber}
            placeholderCount={Math.min(issue.comments, 3)}
          />
        )}
      </Content>
    </>
  );
}

Issue.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  match: PropTypes.object,
}

export default withStyles(styles)(Issue);
