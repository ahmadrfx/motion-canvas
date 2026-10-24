import {makeProject} from '@motion-canvas/core';

import './global.css';

import question from './scenes/01-question?scene';
import noOne from './scenes/02-no-one?scene';
import lazinessBurnout from './scenes/03-laziness-burnout?scene';
import split from './scenes/04-split?scene';
import ball from './scenes/05-ball?scene';
import beThat from './scenes/06-be-that?scene';
import perfection from './scenes/07-perfection?scene';
import zoom from './scenes/08-zoom?scene';
import end from './scenes/09-end?scene';

export default makeProject({
  scenes: [
    question,
    noOne,
    lazinessBurnout,
    split,
    ball,
    beThat,
    perfection,
    zoom,
    end,
  ],
});
