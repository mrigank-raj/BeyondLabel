import { supabase } from '../lib/supabase';

const HISTORY_KEY = 'beyondlabel_history';
const GOALS_KEY = 'beyondlabel_goals';

export const saveToHistory = async (productName, imageUrl, verdictData) => {
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

    // Try to sync to Supabase if available
    if (supabase) {
      const guestId = localStorage.getItem('beyondlabel_guest_id');
      const { data: { session } } = await supabase.auth.getSession();
      
      const userId = session?.user?.id || null;
      
      supabase.from('analyses').insert({
        user_id: userId,
        guest_id: guestId,
        product_name: newItem.productName,
        image_url: newItem.imageUrl,
        goal_id: 'unknown', // Could extract from verdictData if we stored it
        verdict: verdictData
      }).then(({ error }) => {
        if (error) console.error('Supabase sync error:', error);
      });
    }

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
    const verdict = item.verdictData?.verdict;
    // New Taxonomy: Excellent, Good, Moderate, Poor, Avoid
    if (verdict === 'Excellent' || verdict === 'Good') {
      goalAligned++;
    } else if (verdict === 'Poor' || verdict === 'Avoid') {
      flagged++;
    } else if (verdict === 'Moderate') {
      // Could count as neutral, or flagged depending on strictness. Let's say flagged for strict users, but for now we won't count it in 'safe'
    }
  });

  // Calculate ratio based on trustworthy items vs total items
  const safeRatio = Math.round((goalAligned / scanned) * 100) || 0;

  return { safeRatio, scanned, goalAligned, flagged };
};
