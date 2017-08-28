import React from "react";
import "./home.css";

//components
import { Link } from "react-router-dom";

export default class Home extends React.Component {
  render() {
    return (
      <section>
        <header>
          <nav>
<<<<<<< HEAD
            <Link to="/library">
              <p>Library</p>
            </Link>
            <Link to="/recommendations">
              <p>Recommendations</p>
            </Link>
            <Link to="/sign-in">
              <p>Sign in</p>
            </Link>
          </nav>
          <h1>Book Thing</h1>
        </section>
        <section>
          <h2>What are we
          </h2>
=======
            <Link style={{ textDecoration: "none" }} to="/library">
              <p>Library</p>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/recommendations">
              <p>Recommendations</p>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/sign-in">
              <p>Sign in</p>
            </Link>
          </nav>
          <section>
            <img src="/images/header-img.png" />
            <div>
              <h1>
                The Ultimate Book<br />Recommendation Engine
              </h1>
              <button>Get Started</button>
            </div>
          </section>
        </header>
        <section className="home-body">
          <div>
            <h2>What we do</h2>
          </div>
>>>>>>> frontend
          <section>
            <div>
              <h3>What is Book-Thing.io</h3>
              <p>The best book reommendation site in the world.</p>
            </div>
            <div>
              <h3>Why Use Book-Thing.io</h3>
<<<<<<< HEAD
              <p>We give you books you want to read not just the ones that sell the best!
=======
              <p>
                We give you books you want to read not just the ones that sell
                the best!
>>>>>>> frontend
              </p>
            </div>
            <div>
              <h3>How to Use Book-Thing.io</h3>
              <p>
<<<<<<< HEAD
                Simply Log-in, add books, and create recommendations for other users that have read those books</p>
=======
                Simply Log-in, add books, and create recommendations for other
                users that have read those books
              </p>
>>>>>>> frontend
            </div>
          </section>
        </section>
      </section>
    );
  }
}
