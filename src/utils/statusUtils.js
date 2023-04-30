export const getStatusText = (test, production) => {
	if (test.aheadBy > 0 || production.aheadBy > 0) {
		return 'Review needed: Branch ahead of base';
	} else if (test.behindBy === 0 && production.behindBy === 0) {
		return 'Up to date';
	} else if (test.behindBy > 0 && production.behindBy > 0) {
		return 'Changes in progress for staging';
	} else if (test.behindBy === 0 && production.behindBy > 0) {
		return 'Awaiting staging approval';
	}
};

export const getStatusColorClass = (statusText) => {
	switch (statusText) {
		case 'Up to date':
			return 'text-green-500';
		case 'Changes in progress for staging':
			return 'text-yellow-500';
		case 'Awaiting staging approval':
			return 'text-blue-500';
		case 'Review needed: Branch ahead of base':
			return 'text-red-500';
		default:
			return '';
	}
};
