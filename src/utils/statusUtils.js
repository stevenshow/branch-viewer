export const getStatusText = (staging, production) => {
  if (staging?.ahead_by > 0 || production?.ahead_by > 0) {
    return 'Review needed: Branch ahead of base';
  } else if (staging?.behind_by === 0 && production?.behind_by === 0) {
    return 'Up to date';
  } else if (staging?.behind_by > 0 && production?.behind_by > 0) {
    return 'Changes in progress for staging';
  } else if (staging?.behind_by === 0 && production?.behind_by > 0) {
    return 'Awaiting staging approval';
  }
};

export const getStatusColorClass = (statusText) => {
  switch (statusText) {
    case 'Up to date':
      return 'text-green-400';
    case 'Changes in progress for staging':
      return 'text-yellow-400';
    case 'Awaiting staging approval':
      return 'text-blue-400';
    case 'Review needed: Branch ahead of base':
      return 'text-red-400';
    default:
      return 'text-slate-200';
  }
};

export const getBubbleColor = (team) => {
  switch (team) {
    case 'Red Team':
      return 'bg-red-600/70 border border-red-400';
    case 'Green Team':
      return 'bg-green-600/70 border border-green-400';
    case 'Gold Team':
      return 'bg-yellow-600/70 border border-yellow-400';
    case 'Blue Team':
      return 'bg-blue-600/70 border border-blue-400';
  }
};
