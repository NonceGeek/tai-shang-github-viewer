import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Octokit } from '@octokit/rest';

import IssueComment from './IssueComment';

// const COMMENTS_QUERY = gql`
//   query IssueCommentList($owner: String!, $name: String!, $number: Int!) {
//     repository(owner: $owner, name: $name) {
//       issue(number: $number) {
//         id
//         comments(first: 30) {
//           edges {
//             node {
//               id
//               author { login, avatarUrl }
//               body
//               createdAt
//             }  
//           }
//         }
//       }
//     }
//   }
// `;

const IssueCommentList = ({ owner, name, number, placeholderCount }) => {

  const [auth, setAuth] = useState(() => {
    const initialValue = localStorage.getItem("access_token");
    return initialValue || "";
  });

  const octokit = new Octokit({auth: auth});
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      let data = await octokit.rest.issues.listComments({
        owner,
        repo: name,
        issue_number: number,
      }).then(res => res.data);
      setLoading(false);
      setComments(data);
    }
    getData();
  }, [])

  return (

    <>
      {loading ? <div></div> :
        comments.map((comment) => (
          <IssueComment
            key={comment.id}
            body={comment.body}
            createdAt={comment.created_at}
            author={comment.user}
          />
        ))}
    </>
  )
};

IssueCommentList.propTypes = {
  owner: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.number,
  placeholderCount: PropTypes.number,
};

export default IssueCommentList;
