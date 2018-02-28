const reactTemplate = `import React from 'react';

const RandomComponent = props => (
  <div>
    <div>
      <p>{props.title}</p>
      <div>{props.children}</div>
    </div>
  </div>
);

export default RandomComponent;`;
export default reactTemplate;
