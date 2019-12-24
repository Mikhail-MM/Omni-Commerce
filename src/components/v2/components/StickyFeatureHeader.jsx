import React, { Component } from 'react';

import MediaQuery from 'react-responsive';

import DesktopStickyHeader from './DesktopStickyHeader';
import MobileStickyHeader from './MobileStickyHeader';

const StickyFeatureHeader = ({
  setStickyFeatureBarRef,
  setMobileStickyFeatureBarRef,
  manageSticky,
  activeFeature,
}) => (
  <React.Fragment>
    <MediaQuery
      minWidth={2}
      maxWidth={798}
    >
      <MobileStickyHeader
        setMobileStickyFeatureBarRef={setMobileStickyFeatureBarRef}
        manageSticky={manageSticky}
        activeFeature={activeFeature}
      />
    </MediaQuery>
    <MediaQuery
      minWidth={799}
    >
      <DesktopStickyHeader
        setStickyFeatureBarRef={setStickyFeatureBarRef}
        manageSticky={manageSticky}
        activeFeature={activeFeature}
      />
    </MediaQuery>
  </React.Fragment>
);

export default StickyFeatureHeader;
