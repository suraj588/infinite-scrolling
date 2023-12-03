import { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';
const getRandomList = () =>
  new Promise(resolve => {
    const list = [];
    const timeout = 3000;
    for (let i = 0; i < 10; i++) {
      list.push(Math.random() * 10);
    }
    setTimeout(() => {
      resolve(list);
    }, timeout);
    return list;
  });

export default function App() {
  const observer = useRef();
  const [list, setList] = useState({ data: [], isLoading: true });

  useEffect(() => {
    getRandomList().then(res => {
      setList({ data: res, isLoading: false });
    });
  }, []);

  const handleRef = useCallback(e => {
    if (list.isLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(async node => {
      const element = node[0];
      if (element.isIntersecting) {
        setList(prev => ({ ...prev, isLoading: true }));
        const newList = await getRandomList();
        setList(prevList => ({
          data: [...prevList.data, ...newList],
          isLoading: false,
        }));
      }
    });
    if (e) {
      observer.current.observe(e);
    }
  }, [list.isLoading]
);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      {list.data.map((num, index) => {
        if (index === list.data.length - 1) {
          return (
            <h5 key={`${num}-${index}`} ref={handleRef}>
              {num}
            </h5>
          );
        }
        return <h5 key={`${num}-${index}`}>{num}</h5>;
      })}
      {list.isLoading && <h3 style={{ color: 'red' }}>Loading...</h3>}
    </div>
  );
}
