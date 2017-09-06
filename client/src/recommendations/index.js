import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";
import "./recommendation.css";

class Recommendations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userBooks: [],
      list: {
        listName: "",
        tags: ""
      }
    };
  }

  handleListCreation(event) {
    event.preventDefault();
    const list = {
      user_id: this.props.user.id,
      list_name: this.listName.value,
      tags: this.tags.value,
      books: this.state.userBooks
    };

    this.setState({
      list: {
        listName: list.list_name,
        tags: list.tags
      }
    });
    this.listName.value = "";
    this.tags.value = "";
  }

  handleSubmitList(event) {
    const list = {
      user_id: this.props.user.id,
      list_name: this.state.list.listName,
      tags: this.state.list.tags,
      books: this.state.userBooks
    };

    this.props.dispatch(actions.createList(list, this.props.user.token));
    this.props.dispatch(actions.fetchList(this.props.user.token, this.props.user.id));
  }

  handleNewBook(event) {
    event.preventDefault();
    const newBook = {
      title: this.title.value,
      author: this.author.value,
      blurb: this.blurb.value
    };
    this.title.value = "";
    this.author.value = "";
    this.blurb.value = "";
    this.props.dispatch(actions.createBook(newBook, this.props.user.token));
    this.setState({
      userBooks: [
        ...this.state.userBooks,
        newBook
      ]
    });
  }

  render() {
    console.log("My List", this.props.myList);
    const list = this.props.myList.map((list, index) => {
      let bookList = list.books.map((book, index) => {
        return (
          <li key={index}>
            Title: {book.bookTitle}
            <br/>
            Author: {book.bookAuthor}
            <br/>
            Blurb: {book.blurb}
            <br/>
          </li>
        );
      });
      return (
        <ul key={index}>
          <h1>List Name: {list.listTitle}</h1>
          <br/>
          Number of likes: {list.likes}
          <br/> {bookList}
        </ul>
      );
    });

    const books = this.state.userBooks.map((book, index) => {
      return (
        <li key={index}>
          Title: {book.title}
          <br/>
          Author: {book.author}
          <br/>
          Blurb: {book.blurb}
          <br/>
        </li>
      );
    });
    let userForm;
    console.log(this.state.list);
    if (!this.state.list.listName) {
      userForm = (
        <form>
          <input className="listName" type="text" name="listName" placeholder="List Name" ref={listName => (this.listName = listName)}/>
          <input className="tags" type="text" name="tags" placeholder="tags" ref={tags => (this.tags = tags)}/>
          <button className="submitList" type="button" value="Submit" onClick={event => this.handleListCreation(event)}>
            Create List
          </button>
        </form>
      );
    } else {
      userForm = (
        <form>
          <input className="title" type="text" name="Title" placeholder="Title" ref={title => (this.title = title)}/>
          <input className="author" type="text" name="Author" placeholder="Author" ref={author => (this.author = author)}/>
          <textarea className="blurb" name="Blurb" placeholder="Blurb" ref={blurb => (this.blurb = blurb)}/>
          <button className="submitBook" type="button" value="Submit" onClick={event => this.handleNewBook(event)}>
            Create Book
          </button>
          <button className="submitList" type="button" value="Submit" onClick={event => this.handleSubmitList(event)}>
            Create List
          </button>
        </form>
      );
    }
    return (
      <div>
        <h1>Book Recommendations</h1>
        <section>Create a new List {userForm}</section>
        <section className="rec-list">
          Books You Have Created
          <ul>{books}</ul>
          List You Have Created
          <div>{list}</div>
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
