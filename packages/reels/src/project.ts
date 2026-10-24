import {makeProject} from '@motion-canvas/core';

import './global.css';

import stomp from './scenes/stomp?scene';

export default makeProject({
  scenes: [stomp],
});
