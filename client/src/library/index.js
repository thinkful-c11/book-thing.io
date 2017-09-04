import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";

class Library extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.fetchLibrary(this.props.user.token));
  }

  render() {
    const books = this.props.books.map((book, index) => {
      return (
        <li key={book.id}>
          Title: {book.title}
          <br/>
          Author: {book.author}
        </li>
      );
    });
    return (
      <div>
        <h1>Library</h1>
        <ul>{books}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({books: state.library, user: state.user});
export default connect(mapStateToProps)(Library);
