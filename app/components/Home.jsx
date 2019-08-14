import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import sass from './style.scss';

export default class Home extends Component {
  render() {
    return (
      <div className={sass.foo}>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link>
          <br />
          <Link to="/playpen">to Playpen</Link>
        </div>
      </div>
    );
  }
}
