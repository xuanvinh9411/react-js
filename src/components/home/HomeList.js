/*
 * Created by TrungPhat on 18/02/2017
 */
import React, {PropTypes} from 'react';
import HomeListRow from './HomeListRow';

class HomeList extends React.Component{
  constructor (context, props) {
    super(context, props);
  }
  onSubmitReplyForComment(e){
    this.props.onSubmitReplyForComment(e);
  }
  render(){
    let messages=this.props.messages;
    return(
      <div>
        {
          messages.map((message, idx)=>
            <HomeListRow
              loadComments={this.props.loadComments.bind(this)}
              onLikePost={this.props.onLikePost.bind(this)}
              key={idx}
              lng={this.props.lng}
              message={message}
              error={this.props.error}
              loadListReply = {this.props.loadListReply.bind(this)}
              isLoading={this.props.isLoading}
              onSubmitReplyForComment = {this.onSubmitReplyForComment.bind(this)}
              updateStateSubComment = {this.props.updateStateSubComment.bind(this)}
              onShowFormReply = {this.props.onShowFormReply.bind(this)}
              onSubmitComment={this.props.onSubmitComment.bind(this)}
              loadMoresComment={this.props.loadMoresComment.bind(this)}
              updateState={this.props.updateState.bind(this)}
              comment={this.props.comment}
              onTrackingFriend = {this.props.onTrackingFriend.bind(this)}
              onDefinePosition = {this.props.onDefinePosition.bind(this)}
              isLiked = {this.props.isLiked}
              onLoadListLiker = {this.props.onLoadListLiker.bind(this)}
              idPost = {this.props.idPost ? this.props.idPost : null}
            />
          )
        }
      </div>
    );
  }
};

HomeList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default HomeList
