import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Le Nœud Personnalisé ---
const CustomNode = ({ data }) => {
  return (
    <div className="bg-white rounded-md border-2 border-slate-500 shadow-lg p-3 text-center w-48">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-500" />
      <div className="font-bold text-slate-800 text-lg mb-3">{data.label}</div>
      <div className="flex justify-center gap-2">
        <button
          onClick={data.onEdit}
          className="text-xs bg-sky-500 hover:bg-sky-600 text-white font-semibold py-1 px-3 rounded-full"
        >
          Editer
        </button>
        {data.onAddParents && (
          <button
            onClick={data.onAddParents}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1 px-3 rounded-full"
          >
            Ajouter parents
          </button>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-sky-500" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};
// ----------------------------------------------------

// --- LOGIQUE DE POSITIONNEMENT DYNAMIQUE ---
const Y_SPACING = 140;
const NODE_WIDTH = 220;
const MAX_GENERATIONS = 9;

const recalculateLayout = (nodesToLayout) => {
    if (nodesToLayout.length === 0) return [];
    let maxLevel = 0;
    nodesToLayout.forEach(n => {
        const level = Math.floor(Math.log2(n.data.positionInTree));
        if (level > maxLevel) maxLevel = level;
    });
    const totalWidth = Math.pow(2, maxLevel) * NODE_WIDTH;
    return nodesToLayout.map(node => {
        const { positionInTree } = node.data;
        const level = Math.floor(Math.log2(positionInTree));
        const nodesInLevel = Math.pow(2, level);
        const positionInLevel = positionInTree - nodesInLevel + 1;
        const slotWidth = totalWidth / nodesInLevel;
        return {
            ...node,
            position: {
                x: (positionInLevel - 0.5) * slotWidth - (totalWidth / 2),
                y: (maxLevel - level) * Y_SPACING
            }
        };
    });
};
// -------------------------------------------------

function EditTreeView({ onNodeSelect }) {
  const [nodes, setNodes] = useState(() => recalculateLayout([
    { id: '1', type: 'custom', data: { label: 'Enfant', positionInTree: 1 } }
  ]));
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  
  const addParents = useCallback((childNodeId) => {
    let childNode = null;
    setNodes((currentNodes) => {
      childNode = currentNodes.find(n => n.id === childNodeId);
      if (!childNode) return currentNodes;

      const currentPosition = childNode.data.positionInTree;
      const parent1Position = currentPosition * 2;
      const parent2Position = currentPosition * 2 + 1;
      
      const newLevel = Math.floor(Math.log2(parent1Position));
      if (newLevel >= MAX_GENERATIONS) {
        alert(`Vous avez atteint la limite de ${MAX_GENERATIONS} générations.`);
        return currentNodes;
      }

      const newParent1 = { id: `${parent1Position}`, type: 'custom', data: { label: `Parent ${parent1Position}`, positionInTree: parent1Position } };
      const newParent2 = { id: `${parent2Position}`, type: 'custom', data: { label: `Parent ${parent2Position}`, positionInTree: parent2Position } };
      const updatedChildNode = { ...childNode, data: { ...childNode.data, onAddParents: null } };
      
      const nodesBeforeLayout = [...currentNodes.filter(n => n.id !== childNodeId), updatedChildNode, newParent1, newParent2];
      return recalculateLayout(nodesBeforeLayout);
    });

    if (childNode) {
        const parent1Pos = childNode.data.positionInTree * 2;
        const parent2Pos = childNode.data.positionInTree * 2 + 1;
        const newEdges = [
            { id: `e${parent1Pos}-${childNodeId}`, source: `${parent1Pos}`, target: childNodeId, type: 'smoothstep', animated: true },
            { id: `e${parent2Pos}-${childNodeId}`, source: `${parent2Pos}`, target: childNodeId, type: 'smoothstep', animated: true },
        ];
        setEdges((eds) => eds.concat(newEdges));
    }
  }, [setNodes, setEdges]);

  const nodesWithActions = nodes.map(node => {
    const level = Math.floor(Math.log2(node.data.positionInTree));
    const canHaveParents = level < (MAX_GENERATIONS - 1);
    const parentsExist = edges.some(edge => edge.target === node.id);
    return {
      ...node,
      data: {
        ...node.data,
        onAddParents: (canHaveParents && !parentsExist) ? () => addParents(node.id) : null,
        onEdit: () => onNodeSelect(node),
      }
    };
  });

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodesWithActions}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-800"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default EditTreeView;
