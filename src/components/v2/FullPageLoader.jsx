import React from 'react';

import './FullPageLoader.css'

const FullPageLoader = () => {
  return(
    <div class="fp_loader_wrapper" >
      <div class="fp_loader_container" >
        <img 
          style={{
            width: 100,
            height: 100,
          }}
          src={'/assets/TRANSLOGOthin.svg'} />
        <h2> Loading ... </h2>
      </div>
    </div>
  )
}

export default FullPageLoader;