import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { StatisticsCategory, StatisticsItem } from '../types';

// ---------- Color helpers ----------
const COLORS = {
  income: '#1faa5a',
  incomeBg: '#e8f8ee',
  expense: '#e74c5c',
  expenseBg: '#fdeaea',
  total: '#4f6df5',
  totalBg: '#e8ecfd',
  text: '#1f2330',
  textMuted: '#8a8f9e',
  textSubtle: '#a5aab5',
  border: '#e6e8ee',
  surface: '#ffffff',
  background: '#f5f6fa',
  trackBg: '#eef0f5',
};

const CATEGORY_ICON: Record<string, string> = {
  grocery: '🛒',
  food: '🍔',
  restaurant: '🍽️',
  health: '🏥',
  medical: '💊',
  internet: '🌐',
  phone: '📱',
  utility: '💡',
  fuel: '⛽',
  gas: '⛽',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  rent: '🏠',
  housing: '🏠',
  salary: '💰',
  income: '💰',
  refund: '↩️',
  education: '📚',
  travel: '✈️',
  fitness: '🏋️',
  default: '💸',
};

function categoryIcon(name: string): string {
  return CATEGORY_ICON[name.toLowerCase()] ?? CATEGORY_ICON.default;
}

function parsePercentage(percentage: string): number {
  const match = /([\d.]+)/.exec(percentage);
  if (!match) return 0;
  const n = Number.parseFloat(match[1]);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function formatMonth(date: string): string {
  // "2026-10" -> "October 2026"
  const d = new Date(`${date}-01T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatItemDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

// ---------- Metric tile ----------
function MetricTile({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.metricTile, { backgroundColor: bg }]}>
      <Text style={[styles.metricLabel, { color }]}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

// ---------- Item row ----------
function ItemRow({ item }: { item: StatisticsItem }) {
  const positive = item.income;
  const accent = positive ? COLORS.income : COLORS.expense;
  const accentBg = positive ? COLORS.incomeBg : COLORS.expenseBg;
  const titleText = item.title || item.place?.name || item.category;
  const subtitle = item.place?.address;

  return (
    <View style={styles.itemRow}>
      <View style={[styles.itemDot, { backgroundColor: accent }]} />
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {titleText}
        </Text>
        {subtitle ? (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.itemDate}>{formatItemDate(item.date)}</Text>
      </View>
      <View style={[styles.itemPriceBadge, { backgroundColor: accentBg }]}>
        <Text style={[styles.itemPrice, { color: accent }]}>
          {item.formatedPrice}
        </Text>
      </View>
    </View>
  );
}

// ---------- Category card ----------
function CategoryCard({
  category,
  index,
}: {
  category: StatisticsCategory;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index < 2);
  const isIncome = category.income;
  const accent = isIncome ? COLORS.income : COLORS.expense;
  const accentBg = isIncome ? COLORS.incomeBg : COLORS.expenseBg;
  const pct = parsePercentage(category.percentage);
  const itemsCount = category.items.length;

  return (
    <View style={styles.categoryCard}>
      <Pressable
        style={styles.categoryHeader}
        onPress={() => setExpanded((v) => !v)}
      >
        <View style={[styles.categoryIcon, { backgroundColor: accentBg }]}>
          <Text style={styles.categoryIconText}>
            {categoryIcon(category.category)}
          </Text>
        </View>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryTopRow}>
            <Text style={styles.categoryName}>
              {category.category.charAt(0).toUpperCase() +
                category.category.slice(1)}
            </Text>
            <View
              style={[styles.categoryBadge, { backgroundColor: accentBg }]}
            >
              <Text style={[styles.categoryBadgeText, { color: accent }]}>
                {category.percentage}
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${pct}%`,
                  backgroundColor: accent,
                },
              ]}
            />
          </View>
          <View style={styles.categoryBottomRow}>
            <Text style={styles.categoryItemsCount}>
              {itemsCount} item{itemsCount === 1 ? '' : 's'}
            </Text>
            <Text style={[styles.categoryTotal, { color: accent }]}>
              {category.total}
            </Text>
          </View>
        </View>
        <Text style={styles.categoryChevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {expanded && itemsCount > 0 ? (
        <View style={styles.itemsContainer}>
          {category.items.map((item) => (
            <ItemRow key={item._id} item={item} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ---------- Screen ----------
export default function ExpenseScreen() {
  const {
    statistics,
    statisticsLoading,
    statisticsError,
    fetchStatistics,
    user,
  } = useApp();

  useEffect(() => {
    if (user) {
      void fetchStatistics();
    }
  }, [user, fetchStatistics]);

  const categories = useMemo(
    () => statistics?.categoryPrice ?? [],
    [statistics],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerLabel}>Monthly summary</Text>
            <Text style={styles.headerTitle}>
              {statistics ? formatMonth(statistics.date) : '—'}
            </Text>
          </View>
          <Pressable
            style={[
              styles.refreshButton,
              statisticsLoading && styles.refreshDisabled,
            ]}
            onPress={() => void fetchStatistics()}
            disabled={statisticsLoading}
          >
            {statisticsLoading ? (
              <ActivityIndicator size="small" color={COLORS.total} />
            ) : (
              <Text style={styles.refreshText}>↻ Refresh</Text>
            )}
          </Pressable>
        </View>

        {statistics ? (
          <View style={styles.metricsRow}>
            <MetricTile
              label="Incomes"
              value={statistics.incomes}
              color={COLORS.income}
              bg={COLORS.incomeBg}
            />
            <MetricTile
              label="Expenses"
              value={statistics.expenses}
              color={COLORS.expense}
              bg={COLORS.expenseBg}
            />
            <MetricTile
              label="Total"
              value={statistics.total}
              color={COLORS.total}
              bg={COLORS.totalBg}
            />
          </View>
        ) : null}
      </View>

      {statisticsError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{statisticsError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => void fetchStatistics()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {!statistics && statisticsLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.total} />
          <Text style={styles.loadingText}>Loading statistics…</Text>
        </View>
      ) : null}

      {statistics && categories.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>No categories this month</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.sectionCount}>
          {categories.length} total
        </Text>
      </View>

      {categories.map((cat, idx) => (
        <CategoryCard key={cat.category + idx} category={cat} index={idx} />
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.total,
  },
  refreshDisabled: {
    opacity: 0.6,
  },
  refreshText: {
    color: COLORS.total,
    fontSize: 12,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricTile: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: COLORS.expenseBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.expense,
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.expense,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 28,
    marginBottom: 12,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 28,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionCount: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 22,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    backgroundColor: COLORS.trackBg,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryItemsCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  categoryTotal: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryChevron: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginLeft: 10,
  },
  itemsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    backgroundColor: '#fbfbfd',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  itemBody: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: COLORS.textSubtle,
    fontSize: 12,
    marginTop: 2,
  },
  itemDate: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 3,
  },
  itemPriceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
});
