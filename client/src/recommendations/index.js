import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";

class Recommendations extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    const list = {
      user_id: '',
      list_name: '',
      tags: '',
      books: [
        {
          title: this.title.value,
          author: this.author.value,
          blurb: this.blurb.value
        }
      ]
    };
    console.log(this.props.user.token);
    this.props.dispatch(actions.createBook(list.books[0], this.props.user.token));
    this.props.dispatch(actions.createList(list, this.props.user.token));
    this.props.dispatch(actions.fetchLibrary(this.props.user.token));
  }

  render() {
    const list = this.props.myList.map((list, index) => {
      return <li key={list.id}>
        List Name: {list.list_name}</li>;
    });
    return (
      <div>
        <h1>Book Recommendations</h1>
        <section>
          Create a new List
          <form>
            <input className="title" type="text" name="Title" placeholder="Title" ref={title => (this.title = title)}/>
            <input className="author" type="text" name="Author" placeholder="Author" ref={author => (this.author = author)}/>
            <textarea className="blurb" name="Blurb" placeholder="Blurb" ref={blurb => (this.blurb = blurb)}/>
            <button className="submitBook" type="button" value="submit" onClick={event => this.handleSubmit(event)}>
              Submit
            </button>
          </form>
        </section>
        <section>
          Your Lists
          <ul>{list}</ul>
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
