import React from 'react';
import { ElementInspector } from '../src';

export default function Example() {
  return (
    <div className="example">
      <h1>Element Inspector Example</h1>
      <p>Click the inspector button in the bottom right to activate the inspector</p>
      <div className="demo-area">
        <div className="card">
          <h2>Card Title</h2>
          <p>This is a card that can be selected with the element inspector.</p>
          <button>Click Me</button>
        </div>
        <div className="card no-inspect">
          <h2>Excluded Card</h2>
          <p>This card is excluded from selection via the excludeSelector prop.</p>
        </div>
      </div>
      
      <ElementInspector 
        initialIsActive={false}
        excludeSelector=".no-inspect"
      />
    </div>
  );
}
