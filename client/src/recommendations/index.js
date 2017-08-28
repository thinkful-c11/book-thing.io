import React from "react";
import * as actions from "../redux/actions";
import {connect} from "react-redux";

class Recommendations extends React.Component {

  handleSubmit() {
    event.preventDefault();
    const newBook {
      Title : this.title,
      Author : this.author,
      Summary : this.summary
    }
    this.props.dispatch(actions.setBook(newBook));
  }

  render() {

    // const myBooks = this.props.myBooks.map((mybooks, index) => {
    //   return (
    //     <li key={myBook.id}>
    //       Title: {myBook.title}
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
            <input type="text" name="Title" placeholder="Title" ref={(title) => this.title = title.value}/>
            <input type="text" name="Author" placeholder="Author" ref={(author) => this.author = author.value}/>
            <textarea name="Summary" placeholder="Summary" ref={(summary) => this.summary = summary.value}/>
            <button type="button" value="submit" onClick={() => this.handleSubmit()}>Submit</button>
          </form>
          {/* <ul>
            {myBooks}
          </ul> */}

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

// const mapStateToProps = (state) => ({myBooks: state.myLibrary});
// export default connect(mapStateToProps)(Recommendations);
