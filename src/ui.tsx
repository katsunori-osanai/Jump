import * as ReactDOM from 'react-dom';
import {useState, useEffect} from 'react';
import {css} from '@emotion/react';
import {space, color} from './styles/styles';
import SearchBox from './components/SearchBox';
import NodeList from './components/NodeList';

const App = () => {
  const [nodeData, setNodeData] = useState([]);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return function cleanup() {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useEffect(() => {
    if (0 <= activeNodeIndex && activeNodeIndex < nodeData.length) {
      const node = nodeData[activeNodeIndex];
      parent.postMessage({pluginMessage: {type: 'focus-node', node}}, '*');
    }
  }, [activeNodeIndex]);

  const onMessage = (e: any) => {
    const nodeListData = e.data.pluginMessage.nodeList;
    if (nodeListData) {
      setNodeData(nodeListData);
      setActiveNodeIndex(-1);
    }
  };

  const onKeyDown = (e) => {
    if (nodeData.length === 0) {
      return false;
    }

    if (e.key === 'ArrowDown' || (e.key === 'n' && e.ctrlKey)) {
      if (activeNodeIndex < nodeData.length - 1) {
        setActiveNodeIndex((prevIndex) => prevIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || (e.key === 'p' && e.ctrlKey)) {
      if (activeNodeIndex > 0) {
        setActiveNodeIndex((prevIndex) => prevIndex - 1);
      }
    }
  };

  return (
    <main css={Jump} onKeyDown={onKeyDown}>
      <SearchBox />
      <NodeList
        nodeData={nodeData}
        activeNodeIndex={activeNodeIndex}
        onClickNode={setActiveNodeIndex}
      />
    </main>
  );
};

const Jump = css`
  &,
  & * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  font: 12px sans-serif;
  padding: ${space.large};
  color: ${color.dartText};
`;

ReactDOM.render(<App />, document.getElementById('react-page'));
