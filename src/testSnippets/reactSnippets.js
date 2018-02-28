export const reactFunc = `
const RandomComponent = props => (
  <div>
    <div>
      <p>{props.title}</p>
      <div>{props.children}</div>
    </div>
  </div>
);
`;

const reactTemplate = `import React from 'react';
${reactFunc}
export default RandomComponent;`;
export default reactTemplate;
