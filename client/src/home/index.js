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
            <Link
              style={{
                textDecoration: "none"
              }}
              to="/library"
            >
              <p>Library</p>
            </Link>
            <Link
              style={{
                textDecoration: "none"
              }}
              to="/recommendations"
            >
              <p>Recommendations</p>
            </Link>
            <Link
              style={{
                textDecoration: "none"
              }}
              to="/sign-in"
            >
              <p>Sign in</p>
            </Link>
          </nav>
          <section>
            <img
              src="/images/header-img.png"
              alt="Oh no! Something went wrong."
            />
            <div>
              <h1>
                The Ultimate Book<br />Recommendation Engine
              </h1>
              <Link to="/library">
                <button>Get Started</button>
              </Link>
            </div>
          </section>
        </header>
        <section className="home-body">
          <div>
            <h2>What we do</h2>
          </div>
          <section>
            <div>
              <h3>What is Book-Thing.io</h3>
              <p>The best book reommendation site in the world.</p>
            </div>
            <div>
              <h3>Why Use Book-Thing.io</h3>
              <p>
                We give you books you want to read not just the ones that sell
                the best!
              </p>
            </div>
            <div>
              <h3>How to Use Book-Thing.io</h3>
              <p>
                Simply Log-in, add books, and create recommendations for other
                users that have read those books
              </p>
            </div>
          </section>
        </section>
      </section>
    );
  }
}
