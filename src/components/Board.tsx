import { GameState, Player } from '../game/types';
import { pitOwner } from '../game/engine';

interface Props {
  state: GameState;
  onPitClick: (pit: number) => void;
  highlightPits: number[];
  clickablePits: number[];
  isAnimating: boolean;
}

/** Arrange up to 8 seeds in a circle inside a pit. */
function SeedCluster({ count }: { count: number }) {
  const show = Math.min(count, 8);
  const items = [];
  for (let i = 0; i < show; i++) {
    const angle = (i / Math.max(show, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = show > 1 ? 32 : 0;
    const x = 50 + Math.cos(angle) * r;
    const y = 50 + Math.sin(angle) * r;
    items.push(
      <span
        key={i}
        className="seed"
        style={{ left: `${x}%`, top: `${y}%` }}
      />,
    );
  }
  return <>{items}</>;
}

function Pit({
  index,
  seeds,
  onClick,
  clickable,
  highlighted,
  isLastMove,
}: {
  index: number;
  seeds: number;
  onClick: () => void;
  clickable: boolean;
  highlighted: boolean;
  isLastMove: boolean;
}) {
  return (
    <div
      className={`pit ${clickable ? 'pit-clickable' : ''} ${highlighted ? 'pit-capture' : ''} ${isLastMove ? 'pit-last' : ''}`}
      onClick={onClick}
    >
      <div className="pit-bowl">
        <SeedCluster count={seeds} />
      </div>
      <span className="pit-count">{seeds}</span>
    </div>
  );
}

export default function Board({ state, onPitClick, highlightPits, clickablePits, isAnimating }: Props) {
  // Top row displayed left→right as 11,10,9,8,7,6 so sowing reads counter-clockwise
  const topRow = [11, 10, 9, 8, 7, 6];
  const bottomRow = [0, 1, 2, 3, 4, 5];

  const renderPit = (pit: number) => (
    <Pit
      key={pit}
      index={pit}
      seeds={state.board[pit]}
      onClick={() => onPitClick(pit)}
      clickable={clickablePits.includes(pit) && !isAnimating}
      highlighted={highlightPits.includes(pit)}
      isLastMove={state.lastMove === pit}
    />
  );

  return (
    <div className="board">
      <div className="board-row board-row-top">{topRow.map(renderPit)}</div>
      <div className="board-divider" />
      <div className="board-row board-row-bottom">{bottomRow.map(renderPit)}</div>
    </div>
  );
}
