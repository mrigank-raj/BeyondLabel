const HISTORY_KEY = 'beyondlabel_history';
const GOALS_KEY = 'beyondlabel_goals';

export const saveToHistory = (productName, imageUrl, verdictData) => {
  try {
    const history = getHistory();
    const newItem = {
      id: Date.now().toString(),
      productName: productName || 'Unknown Product',
      imageUrl: imageUrl || null,
      verdictData: verdictData,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newItem, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
  } catch (error) {
    console.error('Failed to save to history:', error);
    return null;
  }
};

export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
};

export const getWeeklyInsights = () => {
  const history = getHistory();
  if (history.length === 0) {
    return { safeRatio: 0, scanned: 0, goalAligned: 0, flagged: 0 };
  }

  // Very simple mock logic for insights based on the real history
  const scanned = history.length;
  let goalAligned = 0;
  let flagged = 0;

  history.forEach(item => {
    if (item.verdictData?.verdict === 'Trustworthy') {
      goalAligned++;
    } else if (item.verdictData?.verdict === 'Avoid') {
      flagged++;
    } else if (item.verdictData?.verdict === 'Questionable') {
      flagged++;
    }
  });

  // Calculate ratio based on trustworthy items vs total items
  const safeRatio = Math.round((goalAligned / scanned) * 100) || 0;

  return { safeRatio, scanned, goalAligned, flagged };
};
