import '../assets/scss/transitions.scss';

export const NO_TRANSITION = {
  transitionType: 'none',
  transitionName: 'transition-none',
  transitionEnterTimeout: 0,
  transitionLeaveTimeout: 0
}

export const SLIDE_IN_HORIZONTAL = {
  transitionType: 'horizontal',
  transitionName: 'transition-slide-in-horizontal',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 400,
}

export const SLIDE_IN_VERTICAL = {
  transitionType: 'vertical',
  transitionName: 'transition-slide-in-vertical',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 400,
}

export const SLIDE_OUT_HORIZONTAL = {
  transitionType: 'horizontal',
  transitionName: 'transition-slide-out-horizontal',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 400,
}

export const SLIDE_OUT_VERTICAL = {
  transitionType: 'vertical',
  transitionName: 'transition-slide-out-vertical',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 400,
}

export const CROSSFADE = {
  transitionType: 'fade',
  transitionName: 'transition-crossfade',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 400,
}

export const POP = {
  transitionType: 'pop',
  transitionName: 'transition-pop',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 200,
}

export const FADE_UP = {
  transitionType: 'fade-up',
  transitionName: 'transition-fade-up',
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 200,
}

export function getReverseTransition(transitionType){
  switch(transitionType){
    case 'vertical':
      return SLIDE_OUT_VERTICAL
      break;
    case 'horizontal':
      return SLIDE_OUT_HORIZONTAL
      break;
    case 'fade':
      return CROSSFADE
      break;
    default:
      return NO_TRANSITION;
      break; 
  }
}

