import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";

class Recommendations extends React.Component {

  handleSubmit(event) {
    event.preventDefault();
    const newBook = {
      Title: this.title.value,
      Author: this.author.value,
      Summary: this.summary.value
    }
    this.props.dispatch(actions.setBook(newBook));
  }

  render() {
    console.log(this.props);
    // const myBooks = this.props.myBooks.map((mybooks, index) => {
    //   return (
    //     <li key={myBooks.id}>
    //       Title: {myBooks.title}
    //     </li>
    //   )
    // });

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
            {/* {myBooks} */}
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

const mapStateToProps = (state) => ({myBooks: state.myLibrary});
export default connect(mapStateToProps)(Recommendations);
