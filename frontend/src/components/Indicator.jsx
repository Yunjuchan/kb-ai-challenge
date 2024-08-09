import React from 'react';
import {
  AnimatedIndicator1,
  AnimatedIndicator2,
  AnimatedIndicator3,
  AnimatedIndicator4,
  IndicatorContainer,
} from '../style/indicator';

const Indicator = () => {
  return (
    <IndicatorContainer>
      <AnimatedIndicator1 />
      <AnimatedIndicator2 />
      <AnimatedIndicator3 />
      <AnimatedIndicator4 />
    </IndicatorContainer>
  );
};

export default Indicator;
