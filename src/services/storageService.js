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

    // Update streak and scan count on every new scan
    updateStreak();
    const count = parseInt(localStorage.getItem('beyondlabel_scan_count') || '0', 10);
    localStorage.setItem('beyondlabel_scan_count', (count + 1).toString());

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

/* ─── Streak Tracking System ─── */
const STREAK_KEY = 'beyondlabel_streak';

export const updateStreak = () => {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let current = raw ? JSON.parse(raw) : { count: 0, lastScanDate: null };

    if (current.lastScanDate === today) {
      // Already scanned today
      return current;
    } else if (current.lastScanDate === yesterday) {
      // Consecutive scan
      current = { count: (current.count || 0) + 1, lastScanDate: today };
    } else {
      // Missed a day or first scan
      current = { count: 1, lastScanDate: today };
    }

    localStorage.setItem(STREAK_KEY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.error('Failed to update streak:', err);
    return { count: 1, lastScanDate: new Date().toISOString().split('T')[0] };
  }
};

export const getStreak = () => {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastScanDate: null };
    const data = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If lastScanDate is older than yesterday, streak has expired
    if (data.lastScanDate !== today && data.lastScanDate !== yesterday) {
      return { count: 0, lastScanDate: data.lastScanDate };
    }
    return data;
  } catch (err) {
    return { count: 0, lastScanDate: null };
  }
};

/* ─── Weekly Summary ─── */
export const getWeeklySummary = () => {
  const history = getHistory();
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recent = history.filter(item => {
    const ts = new Date(item.timestamp || 0).getTime();
    return ts >= sevenDaysAgo;
  });

  if (recent.length === 0) {
    return {
      totalScans: 0,
      averageScore: 0,
      mostCommonNasty: null
    };
  }

  let totalScore = 0;
  let scoreCount = 0;
  const nastyCounts = {};

  recent.forEach(item => {
    const vData = item.verdictData || {};
    if (typeof vData.healthScore === 'number') {
      totalScore += vData.healthScore;
      scoreCount++;
    }
    const nasties = vData.hiddenNasties || [];
    nasties.forEach(n => {
      nastyCounts[n] = (nastyCounts[n] || 0) + 1;
    });
  });

  const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  let mostCommonNasty = null;
  let maxCount = 0;
  Object.entries(nastyCounts).forEach(([name, c]) => {
    if (c > maxCount) {
      maxCount = c;
      mostCommonNasty = name;
    }
  });

  return {
    totalScans: recent.length,
    averageScore,
    mostCommonNasty
  };
};
