import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";

class Recommendations extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    const list = {
      user_id: this.props.user.id,
      list_name: this.listName.value,
      tags: this.tags.value,
      books: [
        {
          title: this.title.value,
          author: this.author.value,
          blurb: this.blurb.value
        }
      ]
    };
    this.props.dispatch(actions.createBook(list.books[0], this.props.user.token));
    this.props.dispatch(actions.createList(list, this.props.user.token));
    this.props.dispatch(actions.fetchList(this.props.user.token));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.myList !== nextProps.myList) {
      console.log(this.props.myList.books);
    }
  }

  render() {
    const list = this.props.myList.map((list, index) => {
      return <li key={list.id}>
        List Name: {list.list_name}</li>;
    });

    const books = this.props.myBooks.map((book, index) => {
      return <li key={book.id}>
        Book Title: {book.title}</li>
    });

    return (
      <div>
        <h1>Book Recommendations</h1>
        <section>
          Create a new List
          <form>
            <input className="listName" type="text" name="listName" placeholder="List Name" ref={listName => (this.listName = listName)}/>
            <input className="title" type="text" name="Title" placeholder="Title" ref={title => (this.title = title)}/>
            <input className="author" type="text" name="Author" placeholder="Author" ref={author => (this.author = author)}/>
            <textarea className="blurb" name="Blurb" placeholder="Blurb" ref={blurb => (this.blurb = blurb)}/>
            <input className="tags" type="text" name="tags" placeholder="tags" ref={tags => (this.tags = tags)}/>
            <button className="submitBook" type="button" value="submit" onClick={event => this.handleSubmit(event)}>
              Submit
            </button>
          </form>
        </section>
        <section>
          Your Lists
          <ul>{list}</ul>
          Books in List
          <ul>{books}</ul>
        </section>
        <section>
          Top Recommendations for You
          <ul/>
        </section>
        <section>
          Try these
          <ul/>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({myBooks: state.library, user: state.user, myList: state.list});
export default connect(mapStateToProps)(Recommendations);
