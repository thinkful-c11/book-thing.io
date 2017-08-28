import React from "react";
import {Link} from "react-router-dom";

export default class Home extends React.Component {
  render() {
    return (
      <section>
        <section>
          <nav>
              <Link to="/library"><p>Library</p></Link>
              <Link to="/recommendations"><p>Recommendations</p></Link>
              <Link to="/sign-in"><p>Sign in</p></Link>
          </nav>
          <h1>Book Thing</h1>
        </section>
        <section>
          <h2>What are we </h2>
          <section>
            <div>
              <h3>What is Book-Thing.io</h3>
              <p>The best book reommendation site in the world.</p>
            </div>
            <div>
              <h3>Why Use Book-Thing.io</h3>
              <p>We give you books you want to read not just the ones that sell the best! </p>
            </div>
            <div>
              <h3>How to Use Book-Thing.io</h3>
              <p> Simply Log-in, add books, and create recommendations for other users that have read those books</p>
            </div>
          </section>
        </section>
    </section>
    );
  }
}
