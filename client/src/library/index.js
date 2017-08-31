import React from "react";
import * as actions from "../redux/actions";
import { connect } from "react-redux";

class Library extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.fetchLibrary());
  }

  render() {
    console.log(this.props.books);
    const books = this.props.books.map((book, index) => {
      return (
        <li key={book.id}>
          Title: {book.title} <br />
          Author: {book.author} <br />
          Summary: {book.summary}
        </li>
      );
    });
    console.log(this.props);
    return (
      <div>
        <h1>Library</h1>
        <ul>
          {books}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({ books: state.library });
export default connect(mapStateToProps)(Library);
