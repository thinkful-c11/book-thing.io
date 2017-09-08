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

  //STATE IS A PROBLEM!!!!!!
  //problems
  //Duplciate books being created
  //Like counter not updating on recs

  componentDidMount() {
    this.props.dispatch(actions.fetchList(this.props.user.token, this.props.user.id));
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

    this.props.dispatch(actions.createList(list, this.props.user.token, this.props.user.id));
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
    console.log("Recs", this.props.myRecs);
    console.log("Likes", this.props.likes);
    const recommendation = this.props.myRecs.map((rec, index) => {
      return <li key={index} onClick={() => {
        this.props.dispatch(actions.updateLikes(rec.id, this.props.user.token));
      }}>
        List Name: {rec.list_name}<br/>
        Created By: {rec.creator_name}<br/>
        Likes: {rec.likes_counter}
      </li>
    });
    console.log("My List", this.props.myList);
    const list = this.props.myList.map((list, index) => {
      let bookList = list.books.map((book, index) => {
        return (
          <ul className="book-container" key={index}>
            <li>Title: {book.bookTitle}</li>
            <li>Author: {book.bookAuthor}</li>
            <li>Blurb: {book.blurb}</li>
          </ul>
        );
      });
      return (
        <div className="list-info-container" key={index} onClick={() => {
          this.props.dispatch(actions.fetchRecomendations(this.props.user.token, list.listId));
        }}>
          <div>
            <h5>{list.listTitle}</h5>
            <p>{list.likes}</p>
          </div>
          {bookList}
        </div>
      );
    });

    const books = this.state.userBooks.map((book, index) => {
      return (
        <ul className="book-container" key={index}>
          <li>{book.title}</li>
          <li>{book.author}</li>
          <li>{book.blurb}</li>
        </ul>
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
            New List
          </button>
        </form>
      );
    } else {
      userForm = (
        <div>
          <form>
            <input className="title" type="text" name="Title" placeholder="Title" ref={title => (this.title = title)}/>
            <input className="author" type="text" name="Author" placeholder="Author" ref={author => (this.author = author)}/>
            <textarea className="blurb" name="Blurb" placeholder="Blurb" ref={blurb => (this.blurb = blurb)}/>
          </form>
          <div className="form-button-container">
            <button className="submitBook" type="button" value="Submit" onClick={event => this.handleNewBook(event)}>
              Create Book
            </button>
            <button className="submitList" type="button" value="Submit" onClick={event => this.handleSubmitList(event)}>
              Create List
            </button>
          </div>
        </div>
      );
    }
    return (
      <section className="rec-container">
        <section className="rec-column-1">
          <h3>Create a new List</h3>
          {userForm}
        </section>
        <section className="rec-list rec-column-2">
          <h3>Books You Have Created</h3>
          <div>{books}</div>
          <h3>List You Have Created</h3>
          <div>{list}</div>
        </section>
        <section className="rec-column-3">
          <section>
            <h3>Recommendations for You</h3>
            <div>{recommendation}</div>
          </section>
          <section>
            <h3>Try these</h3>
            <ul/>
          </section>
        </section>
      </section>
    );
  }
}
const mapStateToProps = state => ({myBooks: state.library, user: state.user, myList: state.list, myRecs: state.rec});

export default connect(mapStateToProps)(Recommendations);
