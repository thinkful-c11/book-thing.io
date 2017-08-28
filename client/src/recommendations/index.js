import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";

class Recommendations extends React.Component {

  handleSubmit(event) {
    event.preventDefault();
    const newBook = {
      title: this.title.value,
      author: this.author.value,
      summary: this.summary.value
    }
    this.props.dispatch(actions.createBook(newBook));
    this.props.dispatch(actions.fetchLibrary());
  }

  render() {
    console.log("Look at me", this.props.myBooks);
    const books = this.props.myBooks.map((book, index) => {
      return (
        <li key={book.id}>
          Title: {book.title}
        </li>
      );
    });
    return (
      <div>
        <h1>
          Book Recommendations
        </h1>
        <section>
          Your Books
          <form>
            <input type="text" name="Title" placeholder="Title" ref={title => this.title = title}/>
            <input type="text" name="Author" placeholder="Author" ref={author => this.author = author}/>
            <textarea name="Summary" placeholder="Summary" ref={summary => this.summary = summary}/>
            <button type="button" value="submit" onClick={(event) => this.handleSubmit(event)}>Submit</button>
          </form>
          <ul>
            {books}
          </ul>

        </section>
        <section>
          Top Recommendations for You
          <ul></ul>
        </section>
        <section>
          Try these
          <ul></ul>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({myBooks: state.library});
export default connect(mapStateToProps)(Recommendations);
