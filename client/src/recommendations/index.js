import React from "react";
import * as actions from "../redux/actions";
import { connect } from "react-redux";

class Recommendations extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    const newBook = {
      title: this.title.value,
      author: this.author.value,
      summary: this.summary.value
    };
    console.log(this.props.user.token);
    this.props.dispatch(actions.createBook(newBook, this.props.user.token));
    this.props.dispatch(actions.fetchLibrary(this.props.user.token));
  }

  render() {
    const books = this.props.myBooks.map((book, index) => {
      return <li key={book.id}>Title: {book.title}</li>;
    });
    return (
      <div>
        <h1>Book Recommendations</h1>
        <section>
          Your Books
          <form>
            <input
              className="title"
              type="text"
              name="Title"
              placeholder="Title"
              ref={title => (this.title = title)}
            />
            <input
              className="author"
              type="text"
              name="Author"
              placeholder="Author"
              ref={author => (this.author = author)}
            />
            <textarea
              className="summary"
              name="Summary"
              placeholder="Summary"
              ref={summary => (this.summary = summary)}
            />
            <button
              className="submitBook"
              type="button"
              value="submit"
              onClick={event => this.handleSubmit(event)}
            >
              Submit
            </button>
          </form>
          <ul>{books}</ul>
        </section>
        <section>
          Top Recommendations for You
          <ul />
        </section>
        <section>
          Try these
          <ul />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({ myBooks: state.library, user: state.user });
export default connect(mapStateToProps)(Recommendations);
