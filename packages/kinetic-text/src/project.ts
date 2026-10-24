import {makeProject} from '@motion-canvas/core';

import './global.css';

import kinetic from './scenes/kinetic?scene';

export default makeProject({
  scenes: [kinetic],
});
