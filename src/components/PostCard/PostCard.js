import React, { useContext } from "react";
import moment from "moment";
import { Card, Button, Icon, Label, Image } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import "./PostCard.css";
import { FETCH_POSTS_QUERY } from "../../utils/graphql";
import { AuthContext } from "../../context/auth";
import { Link } from "react-router-dom";
import InfoPopup from "../InfoPopup/InfoPopup";

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      body
      userName
      createdAt
      commentsCount
      likesCount
      likes {
        userName
      }
    }
  }
`;

const PostCard = ({ post, imageSrc }) => {
  const { userData } = useContext(AuthContext);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId: post.id },
    update: (proxy, result) => {
      let { getPosts } = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      getPosts = getPosts.filter((item) => item.id !== post.id);
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [...getPosts],
        },
      });
    },
  });

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: post.id },
  });
  return (
    <>
      <Card fluid className='postCard'>
        <Card.Content>
          {imageSrc && <Image floated='right' size='mini' src={imageSrc} />}
          <Card.Header>{post.userName}</Card.Header>
          <InfoPopup content='Go to Post'>
            <Card.Meta as={Link} to={`/posts/${post.id}`}>
              {moment(post.createdAt).fromNow(true)}
            </Card.Meta>
          </InfoPopup>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button as='div' labelPosition='right' onClick={likePost}>
            {userData &&
            post.likes.find((like) => like.userName === userData.userName) ? (
              <InfoPopup content='Unlike Post'>
                <Button color='red'>
                  <Icon name='heart' />
                </Button>
              </InfoPopup>
            ) : (
              <InfoPopup content='Like Post'>
                <Button color='red' basic>
                  <Icon name='heart' />
                </Button>
              </InfoPopup>
            )}
            <Label as='a' basic color='red' pointing='left'>
              {post.likesCount}
            </Label>
          </Button>
          <InfoPopup content='Show Comment'>
            <Button as={Link} labelPosition='right' to={`/posts/${post.id}`}>
              <Button basic color='blue'>
                <Icon name='comments' />
              </Button>
              <Label as='a' basic color='blue' pointing='left'>
                {post.commentsCount}
              </Label>
            </Button>
          </InfoPopup>
          {userData && userData.userName === post.userName && (
            <InfoPopup content='Delete Post'>
              <Button color='red' floated='right' onClick={deletePost}>
                <Icon name='trash' />
              </Button>
            </InfoPopup>
          )}
        </Card.Content>
      </Card>
    </>
  );
};

export default PostCard;
