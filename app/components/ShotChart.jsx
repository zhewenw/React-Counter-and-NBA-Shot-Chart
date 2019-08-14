import React, { Component } from 'react';
import * as PIXI from 'pixi.js';

const { array } = React.PropTypes;
const COURT_WIDTH = 50;
const SIZE = 512;
const SCALE_FACTOR = SIZE / COURT_WIDTH;
const IMG_SCALE_FACTOR = SIZE / 754;

// Load the halfcourt image resource only once!
PIXI.loader.add('../resources/halfcourt.png');
let loaded = false;
PIXI.loader.load(afterLoaded);

function afterLoaded() {
  loaded = true;
}

export default class ShotChart extends Component {
  static propTypes = {
    shots: array,
  };

  constructor() {
    super();
    this.stage = null;
    this.shots = [];
  }

  componentDidMount() {
    this.setupStage();
  }

  componentWillUpdate(nextProps) {
    // If props change, remove all shots from stage
    if (this.stage != null && nextProps !== this.props) {
      for (const s of this.shots) {
        this.stage.removeChild(s);
      }

      this.populateShots(nextProps.shots);
    }
  }

  componentDidUpdate() {
    this.renderer.render(this.stage);
  }

  setupStage() {
    this.stage = new PIXI.Container();
    this.renderer = new PIXI.CanvasRenderer(SIZE, SIZE, { transparent: true });
    this.container.appendChild(this.renderer.view);

    if (loaded) {
      const court = new PIXI.Sprite(
          PIXI.loader.resources['../resources/halfcourt.png'].texture);
      court.scale.set(IMG_SCALE_FACTOR, IMG_SCALE_FACTOR);
      this.stage.addChild(court);
    }

    this.populateShots(this.props.shots);
    this.renderer.render(this.stage);
  }

  populateShots(shots) {
    this.shots = this.createShots(shots);
    for (const s of this.shots) {
      this.stage.addChild(s);
    }
  }

  createShots(shots) {
    // TODO: Define these colors elsewhere
    const madeColor = 0x33CC33;
    const missedColor = 0xCC3333;

    return shots.map(shot => {
      const color = shot.made ? madeColor : missedColor;
      const g = new PIXI.Graphics();
      g.beginFill(color);
      g.drawCircle(SCALE_FACTOR * shot.y, SCALE_FACTOR * shot.x, 5);
      g.endFill();
      return g;
    });
  }

  render() {
    const props = {
      ref: c => (this.container = c),
    };

    return <div {...props} />;
  }
}
