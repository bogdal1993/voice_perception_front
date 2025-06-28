import React, { useState, useEffect } from 'react';

const UseEffectExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // useEffect is called after the initial render and after every render
  useEffect(() => {
    setIsMounted(true);
    // This effect runs after every render
    document.title = `You clicked ${count} times`;

    // Cleanup function (optional)
    return () => {
      document.title = 'React App';
      setIsMounted(false);
    };
  });

  // useEffect with dependency array
  useEffect(() => {
    // This effect runs only when count changes
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      {isMounted && <p>The component is mounted.</p>}
    </div>
  );
};

export default UseEffectExample;
